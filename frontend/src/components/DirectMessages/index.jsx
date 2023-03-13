import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { csrfFetch } from "../../store/csrf";
import { getDmMessages } from "../../store/messages";
import NewDMForm from "./NewDMForm";

const DirectMessagesList = ({ directMessages, setMessages, setRoom }) => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [ showCreateDM, setShowCreateDM ] = useState(false);
  const [showNewDMForm, setShowNewDMForm] = useState(false);
  const images = useSelector((state) => state.images);
  const wrapperRef = useRef(null);

  const directMessagesList = directMessages.filter(
    (dm) => dm.ChatMembers.length > 0
  );

  const showMessages = async (id) => {
    const res = await dispatch(getDmMessages(id));
  };


  function closeNewDMForm(ref) {
    useEffect(() => {
      /**
       * Close if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowNewDMForm(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  closeNewDMForm(wrapperRef);

  return (
    <div className="flex w-full flex-col items-center justify-start">
      {showNewDMForm && (
        <NewDMForm wrapperRef={wrapperRef} setShowNewDMForm={setShowNewDMForm} />
      )}
      <div className="flex w-full justify-between">
        <p className="w-full text-lightGray uppercase">Direct Messages</p>
        <div
          onClick={() => setShowNewDMForm((prev) => !prev)}
          className="text-lightGray cursor-pointer text-lg"
          onMouseEnter={() => setShowCreateDM(true)}
          onMouseLeave={() => setShowCreateDM(false)}
        >
          +
          <div
            className={`${showCreateDM ? 'inline' : 'hidden'} absolute w-fit h-fit bg-black text-white rounded-md right-1 z-50 flex items-center`}
          >
            <div className="relative w-2 h-2 bg-black rotate-45 -top-4 left-16"></div>
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
