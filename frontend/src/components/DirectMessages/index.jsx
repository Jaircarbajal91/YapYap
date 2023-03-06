import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { csrfFetch } from "../../store/csrf";
import { getDmMessages } from "../../store/messages";

const DirectMessagesList = ({ directMessages, setMessages, setRoom }) => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [ showCreateDM, setShowCreateDM ] = useState(false);
  const images = useSelector((state) => state.images);

  const directMessagesList = directMessages.filter(
    (dm) => dm.ChatMembers.length > 0
  );

  const showMessages = async (id) => {
    const res = await dispatch(getDmMessages(id));
  };


  return (
    <div className="flex w-full flex-col items-center justify-start">
      <div className="flex w-full justify-between">
        <p className="w-full text-lightGray uppercase">Direct Messages</p>
        <div
          className="text-lightGray cursor-pointer text-lg"
          onMouseEnter={() => setShowCreateDM(true)}
          onMouseLeave={() => setShowCreateDM(false)}
        >
          +
          <div
            className={`${showCreateDM ? 'inline' : 'hidden'} absolute w-fit h-fit bg-black text-white rounded-md right-1 z-50 flex items-center`}
          >
            <div className="relative w-2 h-2 bg-black rotate-45 -top-4 left-14"></div>
            <span className="p-2 -ml-1 text-center capitalize font-bold text-xs">Create DM</span>
          </div>
        </div>
      </div>
      {directMessagesList.map((dm) => {
        return (
          <div
            key={dm.id}
            className="w-full flex items-center gap-4 hover:bg-demoButtonHover px-2 py-1 rounded-md cursor-pointer"
            onClick={() => {
              setRoom(dm.id);
              showMessages(dm.id)
            }}
          >
            <img
              className="w-10 h-10 rounded-full"
              src={
                dm.ChatMembers.length > 1
                  ? `https://api.dicebear.com/5.x/identicon/svg?seed=Aneka&backgroundType=gradientLinear`
                  : images[11]?.url
              }
              alt="avatar"
            />
            <div className="w-full flex flex-col min-h-2">
              <div className="w-full flex gap-2 items-center justify-start">
                {dm.ChatMembers.map((member, i) => {
                  return (
                    <span key={member.id} className="text-lightGray">
                      {member.User.alias
                        ? member.User.alias
                        : member.User.username}
                      {i !== dm.ChatMembers.length - 1 &&
                      dm.ChatMembers.length > 1
                        ? ", "
                        : " "}
                    </span>
                  );
                })}
              </div>
              <p className="text-lightGray text-sm">
                {dm.ChatMembers.length > 1
                  ? `${dm.ChatMembers.length} members`
                  : ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DirectMessagesList;
