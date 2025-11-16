import { useState, useRef, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { createDMRoom, getDirectMessages } from "../../store/directMessages";
import { fetchFriends } from "../../store/session";
import check from "../../../assets/images/check.svg";

const ITEM_HEIGHT = 64; // Approximate height of each friend item in pixels
const VISIBLE_ITEMS = 7; // Number of items visible in viewport
const BUFFER_ITEMS = 2; // Extra items to render above/below viewport for smooth scrolling

const NewDMForm = ({ setShowNewDMForm, wrapperRef, setRoom }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const friends = useSelector((state) => state.session.friends);
  const [filteredFriends, setFilteredFriends] = useState(friends);
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Refresh friends list when modal opens or when component mounts
    const loadFriends = async () => {
      setLoading(true);
      try {
        await dispatch(fetchFriends());
      } catch (error) {
        console.error("Error loading friends:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFriends();
  }, [dispatch]);

  useEffect(() => {
    setFilteredFriends(friends);
    console.log("Friends updated:", friends.length);
  }, [friends]);

  const filterFriends = (e) => {
    const filteredFriends = friends.filter((friend) => {
      if (friend.alias) {
        return friend.alias.toLowerCase().includes(e.target.value.toLowerCase());
      } else {
        return friend.username
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      }
    });
    setFilteredFriends(filteredFriends);
    return filteredFriends;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFriends.length === 0) return;
    setIsCreating(true);
    try {
      const room = await dispatch(createDMRoom(selectedFriends));
      if (room && room.id) {
        await dispatch(getDirectMessages());
        // Open the newly created DM
        if (setRoom) {
          setRoom(room.id);
        }
        setShowNewDMForm(false);
      } else {
        console.error("Failed to create DM room");
      }
    } catch (e) {
      console.error("Error creating DM:", e);
    } finally {
      setIsCreating(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowNewDMForm(false);
    }
  };

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  // Calculate which items to render based on scroll position
  const { visibleItems, startIndex, endIndex, totalHeight } = useMemo(() => {
    if (!filteredFriends.length) {
      return { visibleItems: [], startIndex: 0, endIndex: 0, totalHeight: 0 };
    }

    const containerHeight = scrollContainerRef.current?.clientHeight || VISIBLE_ITEMS * ITEM_HEIGHT;
    const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT);
    
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_ITEMS);
    const endIndex = Math.min(
      filteredFriends.length - 1,
      startIndex + visibleCount + (BUFFER_ITEMS * 2)
    );

    const visibleItems = filteredFriends.slice(startIndex, endIndex + 1);

    return {
      visibleItems,
      startIndex,
      endIndex,
      totalHeight: filteredFriends.length * ITEM_HEIGHT,
    };
  }, [filteredFriends, scrollTop]);

  // Reset scroll position when filtered friends change
  useEffect(() => {
    if (scrollContainerRef.current) {
      setScrollTop(0);
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [filteredFriends.length]);

  const modalContent = (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={handleBackdropClick}
      />
      <div
        ref={wrapperRef}
        id="new-dm-form"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-[420px] bg-demoButton z-[9999] rounded-lg overflow-hidden shadow-2xl border border-darkGray"
        style={{ maxHeight: '85vh' }}
      >
        <div className="flex flex-col w-full" style={{ maxHeight: '85vh' }}>
          <div className="px-6 pt-6 pb-4 flex-shrink-0">
            <h3 className="text-offWhite font-semibold text-xl mb-4">
              Select Friends
            </h3>
            <div className="relative">
              <input
                className="w-full h-10 focus:outline-none bg-demoButtonHover text-sm px-3 py-2 text-offWhite placeholder-lightGray rounded-md border border-transparent focus:border-hero focus:ring-2 focus:ring-hero/20 transition-all duration-200"
                placeholder="Type the username of a friend"
                onChange={filterFriends}
                type="text"
                autoFocus
              />
            </div>
          </div>
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-2 scrollbar min-h-0 transition-all duration-300"
            onScroll={handleScroll}
            style={{ 
              maxHeight: `${Math.min(VISIBLE_ITEMS - 1, filteredFriends.length) * ITEM_HEIGHT}px`,
              minHeight: `${Math.min(3, filteredFriends.length || 1) * ITEM_HEIGHT}px`
            }}
          >
            <div 
              className="flex flex-col w-full relative"
              style={{ height: `${totalHeight || ITEM_HEIGHT}px` }}
            >
              {loading ? (
                <div className="px-4 py-8 text-center absolute inset-0 flex items-center justify-center">
                  <p className="text-lightGray text-sm">Loading friends...</p>
                </div>
              ) : filteredFriends.length === 0 && friends.length === 0 ? (
                <div className="px-4 py-8 text-center absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-lightGray text-sm mb-2">You don't have any friends yet</p>
                  <p className="text-lightGray text-xs">Add friends using the user-plus icon to start a direct message</p>
                </div>
              ) : filteredFriends.length === 0 ? (
                <div className="px-4 py-8 text-center absolute inset-0 flex items-center justify-center">
                  <p className="text-lightGray text-sm">No friends found matching your search</p>
                </div>
              ) : (
                <>
                  {/* Spacer for items above viewport */}
                  {startIndex > 0 && (
                    <div style={{ height: `${startIndex * ITEM_HEIGHT}px` }} />
                  )}
                  {/* Render only visible items */}
                  {visibleItems.map((friend) => {
                    const isSelected = selectedFriends.includes(friend.id);
                    return (
                      <div
                        onClick={() => {
                          if (isSelected) {
                            setSelectedFriends(
                              selectedFriends.filter((id) => id !== friend.id)
                            );
                          } else {
                            setSelectedFriends([...selectedFriends, friend.id]);
                          }
                        }}
                        key={friend.id}
                        style={{ height: `${ITEM_HEIGHT}px` }}
                        className={`flex items-center justify-between hover:bg-demoButtonHover rounded-md p-2 mx-2 cursor-pointer transition-colors duration-150 ${
                          isSelected ? "bg-demoButtonHover/50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img
                            className="w-10 h-10 rounded-full flex-shrink-0"
                            src={
                              !friend.Image
                                ? `https://api.dicebear.com/5.x/identicon/svg?seed=${encodeURIComponent(friend.alias || friend.username)}&backgroundType=gradientLinear`
                                : friend.Image.url
                            }
                            alt="avatar"
                            loading="lazy"
                          />
                          <span className="text-offWhite text-sm font-medium truncate">
                            {friend.alias ? friend.alias : friend.username}
                          </span>
                        </div>
                        <div
                          className={`flex items-center justify-center w-5 h-5 border-2 rounded flex-shrink-0 transition-all duration-200 ${
                            isSelected
                              ? "bg-hero border-hero"
                              : "border-gray hover:border-lightGray"
                          }`}
                        >
                          {isSelected && (
                            <img className="w-3 h-3" src={check} alt="check" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* Spacer for items below viewport */}
                  {endIndex < filteredFriends.length - 1 && (
                    <div 
                      style={{ 
                        height: `${(filteredFriends.length - endIndex - 1) * ITEM_HEIGHT}px` 
                      }} 
                    />
                  )}
                </>
              )}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-darkGray bg-demoButton transition-all duration-300 ease-in-out flex-shrink-0">
            <button
              onClick={handleSubmit}
              disabled={isCreating || selectedFriends.length === 0}
              className="w-full h-10 bg-hero hover:bg-heroDark disabled:bg-hero/30 disabled:cursor-not-allowed disabled:hover:bg-hero/30 text-offWhite font-medium rounded-md transition-all duration-200 hover:shadow-lg hover:shadow-hero/20 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:hover:scale-100"
            >
              {isCreating ? (
                "Creating DM..."
              ) : selectedFriends.length === 0 ? (
                "Select friends to create a direct message"
              ) : (
                <>
                  Create Direct Message {selectedFriends.length > 1 && `(${selectedFriends.length})`}
                </>
              )}
            </button>
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

export default NewDMForm;
