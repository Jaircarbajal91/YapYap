import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createDMRoom, getDirectMessages } from "../../store/directMessages";
import check from "../../../assets/images/check.svg";

const NewDMForm = ({ setShowNewDMForm, wrapperRef }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [clicked, setClicked] = useState(false);
  const users = useSelector((state) => state.session.users);
  const sessionUser = useSelector((state) => state.session.user);
  const friends = users.filter((user) => user.id !== sessionUser.id);
  const [filteredFriends, setFilteredFriends] = useState(friends);
  const dispatch = useDispatch();

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
    try {
      const room = await dispatch(createDMRoom(selectedFriends));
      if (room) {
        dispatch(getDirectMessages());
        setShowNewDMForm(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      ref={wrapperRef}
      id="new-dm-form"
      className="absolute flex flex-col items-center justify-between py-2 px-3 left-[16%] top-[3.5%] w-[18em] h-[17em] bg-demoButton z-50 rounded-md overflow-auto shadow-md border-[1px] border-darkGray"
    >
      <div className="flex flex-col w-full max-h-[82%]">
        <h3 className="text-offWhite font-medium tracking-wide mb-4">
          Select Friends
        </h3>
        <input
          className="w-full min-h-[2em] focus:outline-none bg-demoButtonHover text-sm px-2 mb-1 text-lightGray rounded-md"
          placeholder="Type the username of a friend" onChange={filterFriends} type="text" />
        <div className="scrollbar flex flex-col w-full overflow-auto">
          {filteredFriends.map((friend) => {
            return (
              <div
                onClick={() => {
                  if (selectedFriends.includes(friend.id)) {
                    setSelectedFriends(
                      selectedFriends.filter((id) => id !== friend.id)
                    );
                  } else {
                    setSelectedFriends([...selectedFriends, friend.id]);
                  }
                }}
                key={friend.id}
                className="flex  items-center justify-between hover:bg-demoButtonHover rounded-sm p-2 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={
                      !friend.Image
                        ? `https://api.dicebear.com/5.x/identicon/svg?seed=Aneka&backgroundType=gradientLinear`
                        : friend.Image.url
                    }
                    alt="avatar"
                  />
                  <span className="text-lightGray text-sm">
                    {friend.alias ? friend.alias : friend.username}
                  </span>
                </div>
                <div className="flex items-center justify-center w-[1.5em] h-[1.5em] border-lightGray border-[1px] rounded-md">
                  {selectedFriends.includes(friend.id) && (
                    <img className="w-4 h-4" src={check} alt="check" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute flex justify-center bottom-1 min-w-full p-2 border-t-[1px] border-gray">
        <button onClick={handleSubmit} className="w-full p-1 bg-[#5865F2] text-offWhite rounded-md">
          Create DM
        </button>
      </div>
    </div>
  );
};

export default NewDMForm;
