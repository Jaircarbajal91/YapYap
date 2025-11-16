import DirectMessagesList from "../DirectMessages";
import Channels from "../Channels/ChannelForm";
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
  const images = useSelector((state) => state.images);

  const currentUser = users.find((user) => user.id === sessionUser?.id);
  const displayUser = currentUser || sessionUser;

  useEffect(() => {
    dispatch(getDirectMessages()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const profileImageUrl =
    currentUser?.Image?.url ||
    (displayUser?.imageId ? images?.[displayUser.imageId]?.url : null);

  return (
    isLoaded && (
      <div className="relative z-40 flex w-full flex-col border-borderMuted/60 border-r bg-surfaceLight/70 text-offWhite shadow-inner-card backdrop-blur md:min-w-[18rem] md:max-w-[19rem]">
        <div className="scrollbar flex-1 overflow-x-visible overflow-y-auto px-4 py-4 relative z-0">
          {serverClicked ? (
            <Channels />
          ) : (
            <DirectMessagesList
              setRoom={setRoom}
              directMessages={directMessages}
            />
          )}
        </div>
        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-borderMuted/60 bg-surface/95 px-4 py-3 shadow-inner-card">
          <div className="flex items-center gap-3 text-sm font-medium text-offWhite">
            <img
              className="h-9 w-9 min-h-[2.25rem] min-w-[2.25rem] rounded-full object-cover shadow-soft-card"
              src={
                profileImageUrl ||
                `https://api.dicebear.com/5.x/identicon/svg?seed=${encodeURIComponent(
                  displayUser?.username || "Guest"
                )}&backgroundType=gradientLinear`
              }
              alt={`${displayUser?.username || "Guest"} avatar`}
            />
            <span>{displayUser?.username || "Guest"}</span>
          </div>
          <Logout />
        </div>
      </div>
    )
  );
};

export default MidSection;
