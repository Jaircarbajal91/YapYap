import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { csrfFetch } from "../../store/csrf";
import { getDmMessages } from "../../store/messages";

const DirectMessagesList = ({ directMessages, setMessages, setRoom }) => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const images = useSelector((state) => state.images);

  const directMessagesList = directMessages.filter(
    (dm) => dm.ChatMembers.length > 0
  );

  const showMessages = async (id) => {
    const res = await dispatch(getDmMessages(id));
  };


  return (
    <div className="flex w-full flex-col items-center justify-start">
      <p className="w-full text-lightGray uppercase">Direct Messages</p>
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
