import { useState, useRef, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { addFriendAction, fetchNonFriends } from "../../store/session";

const ITEM_HEIGHT = 64;
const VISIBLE_ITEMS = 7;
const BUFFER_ITEMS = 2;

const AddFriendForm = ({ setShowAddFriendForm, wrapperRef, onFriendAdded }) => {
  const [nonFriends, setNonFriends] = useState([]);
  const [filteredNonFriends, setFilteredNonFriends] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    const loadNonFriends = async () => {
      setLoading(true);
      try {
        const users = await dispatch(fetchNonFriends());
        console.log("Fetched non-friends:", users);
        if (users && Array.isArray(users)) {
          setNonFriends(users);
          setFilteredNonFriends(users);
          console.log("Set non-friends count:", users.length);
        } else {
          console.log("No users returned or not an array");
          setNonFriends([]);
          setFilteredNonFriends([]);
        }
      } catch (error) {
        console.error("Error loading non-friends:", error);
        setNonFriends([]);
        setFilteredNonFriends([]);
      } finally {
        setLoading(false);
      }
    };
    if (sessionUser) {
      loadNonFriends();
    }
  }, [dispatch, sessionUser]);

  const filterNonFriends = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = nonFriends.filter((user) => {
      if (user.alias) {
        return user.alias.toLowerCase().includes(searchTerm);
      } else {
        return user.username.toLowerCase().includes(searchTerm);
      }
    });
    setFilteredNonFriends(filtered);
  };

  const handleAddFriend = async (friendId) => {
    try {
      const response = await dispatch(addFriendAction(friendId));
      if (response && response.ok) {
        // Remove from non-friends list
        const updatedNonFriends = nonFriends.filter((user) => user.id !== friendId);
        setNonFriends(updatedNonFriends);
        setFilteredNonFriends(
          filteredNonFriends.filter((user) => user.id !== friendId)
        );
        console.log("Friend added successfully, removed from list");
        // Notify parent component to refresh friends list
        if (onFriendAdded) {
          onFriendAdded();
        }
      } else {
        console.error("Failed to add friend:", response);
        if (response && response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          alert(errorData.error || "Failed to add friend");
        }
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      alert("An error occurred while adding friend");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowAddFriendForm(false);
    }
  };

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const { visibleItems, startIndex, endIndex, totalHeight } = useMemo(() => {
    if (!filteredNonFriends.length) {
      return { visibleItems: [], startIndex: 0, endIndex: 0, totalHeight: 0 };
    }

    const containerHeight =
      scrollContainerRef.current?.clientHeight || VISIBLE_ITEMS * ITEM_HEIGHT;
    const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT);

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_ITEMS
    );
    const endIndex = Math.min(
      filteredNonFriends.length - 1,
      startIndex + visibleCount + BUFFER_ITEMS * 2
    );

    const visibleItems = filteredNonFriends.slice(startIndex, endIndex + 1);

    return {
      visibleItems,
      startIndex,
      endIndex,
      totalHeight: filteredNonFriends.length * ITEM_HEIGHT,
    };
  }, [filteredNonFriends, scrollTop]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      setScrollTop(0);
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [filteredNonFriends.length]);

  const modalContent = (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={handleBackdropClick}
      />
      <div
        ref={wrapperRef}
        id="add-friend-form"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-[420px] max-h-[500px] bg-demoButton z-[9999] rounded-lg overflow-hidden shadow-2xl border border-darkGray"
      >
        <div className="flex flex-col w-full h-full">
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-offWhite font-semibold text-xl mb-4">
              Add Friend
            </h3>
            <div className="relative">
              <input
                className="w-full h-10 focus:outline-none bg-demoButtonHover text-sm px-3 py-2 text-offWhite placeholder-lightGray rounded-md border border-transparent focus:border-hero focus:ring-2 focus:ring-hero/20 transition-all duration-200"
                placeholder="Type the username of a user"
                onChange={filterNonFriends}
                type="text"
                autoFocus
              />
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-2 scrollbar min-h-0 transition-all duration-300 pb-4"
            onScroll={handleScroll}
            style={{ maxHeight: `${VISIBLE_ITEMS * ITEM_HEIGHT}px` }}
          >
            <div
              className="flex flex-col w-full relative"
              style={{ height: `${totalHeight || ITEM_HEIGHT}px` }}
            >
              {loading ? (
                <div className="px-4 py-8 text-center absolute inset-0 flex items-center justify-center">
                  <p className="text-lightGray text-sm">Loading users...</p>
                </div>
              ) : filteredNonFriends.length === 0 && nonFriends.length === 0 ? (
                <div className="px-4 py-8 text-center absolute inset-0 flex items-center justify-center">
                  <p className="text-lightGray text-sm">
                    No users available to add
                  </p>
                </div>
              ) : filteredNonFriends.length === 0 ? (
                <div className="px-4 py-8 text-center absolute inset-0 flex items-center justify-center">
                  <p className="text-lightGray text-sm">No users found</p>
                </div>
              ) : (
                <>
                  {startIndex > 0 && (
                    <div style={{ height: `${startIndex * ITEM_HEIGHT}px` }} />
                  )}
                  {visibleItems.map((user) => {
                    return (
                      <div
                        key={user.id}
                        style={{ height: `${ITEM_HEIGHT}px` }}
                        className="flex items-center justify-between hover:bg-demoButtonHover rounded-md p-2 mx-2 cursor-pointer transition-colors duration-150"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img
                            className="w-10 h-10 rounded-full flex-shrink-0"
                            src={
                              !user.Image
                                ? `https://api.dicebear.com/5.x/identicon/svg?seed=${encodeURIComponent(
                                    user.alias || user.username
                                  )}&backgroundType=gradientLinear`
                                : user.Image.url
                            }
                            alt="avatar"
                            loading="lazy"
                          />
                          <span className="text-offWhite text-sm font-medium truncate">
                            {user.alias ? user.alias : user.username}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAddFriend(user.id)}
                          className="px-4 py-1.5 bg-hero hover:bg-heroDark text-offWhite text-sm font-medium rounded-md transition-all duration-200 hover:shadow-lg hover:shadow-hero/20 transform hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
                        >
                          Add
                        </button>
                      </div>
                    );
                  })}
                  {endIndex < filteredNonFriends.length - 1 && (
                    <div
                      style={{
                        height: `${
                          (filteredNonFriends.length - endIndex - 1) *
                          ITEM_HEIGHT
                        }px`,
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (typeof document !== "undefined" && document.body) {
    return ReactDOM.createPortal(modalContent, document.body);
  }
  return null;
};

export default AddFriendForm;

