import DirectMessagesList from "../DirectMessages";
import Channels from "../Channels";
import { useSelector, useDispatch } from "react-redux";
import { getDirectMessages } from "../../store/directMessages";
import { useEffect, useState } from "react";
import Logout from "../../auth/Logout";

const MidSection = ({ serverClicked, setMessages, setRoom }) => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  const directMessages = Object.values(useSelector((state) => state.dms));
  const sessionUser = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.session.users);

  const currentUser = users.find((user) => user.id === sessionUser.id);

  useEffect(() => {
    dispatch(getDirectMessages()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    isLoaded &&
    directMessages.length > 0 && (
      <div className="min-w-[18em] w-[18em] max-w-[18em] min-h-screen max-h-screen flex flex-col bg-midGray">
        <div className="min-w-full scrollbar max-w-full py-2 px-3 min-h-[92%] max-h-[92%] overflow-auto flex flex-col items-start justify-between">
          {serverClicked ? (
            <Channels />
          ) : (
            <DirectMessagesList
              setRoom={setRoom}
              directMessages={directMessages}
            />
          )}
        </div>
        <div className="fixed bottom-0 w-[18em] flex justify-between p-2 bg-demoButton">
          <div className="flex items-center gap-2 text-offWhite text-sm font-medium">
            <img
              className="w-[2em] h-[2em] min-w-[2em] min-h-[2em] rounded-full object-cover"
              src={
                currentUser?.Image
                  ? currentUser.Image.url
                  : `https://api.dicebear.com/5.x/identicon/svg?seed=Aneka&backgroundType=gradientLinear`
              }
              alt=""
            />
            <span>{currentUser.username}</span>
          </div>
          <Logout />
        </div>
      </div>
    )
  );
};

export default MidSection;
