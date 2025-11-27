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
      <div className="relative z-40 flex w-full flex-col border-borderMuted/60 border-r bg-surfaceLight/70 text-offWhite shadow-inner-card backdrop-blur md:min-w-[18rem] md:max-w-[19rem] hidden md:flex">
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

// Mobile version of MidSection for DM list
export const MidSectionMobile = ({ serverClicked, setMessages, setRoom, activeDmId, isDMDrawerOpen, setIsDMDrawerOpen }) => {
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

  const handleCloseDrawer = () => {
    setIsDMDrawerOpen(false);
  };

  return (
    isLoaded && (
      <>
        {/* Mobile overlay */}
        <div 
          className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isDMDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={handleCloseDrawer}
          onTouchStart={handleCloseDrawer}
        />
        {/* Mobile drawer */}
        <div className={`md:hidden fixed left-0 top-0 bottom-0 z-50 w-[85vw] max-w-[19rem] bg-surfaceLight/95 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isDMDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`} style={{ height: '100dvh' }}>
          {/* Mobile drawer header */}
          <div className="flex-shrink-0 flex items-center justify-between gap-2 bg-surfaceLight/95 backdrop-blur-sm border-b border-borderMuted/60 px-3 py-2.5 shadow-soft-card sm:gap-3 sm:px-4 sm:py-3">
            <h2 className="text-offWhite text-sm font-semibold sm:text-base">Direct Messages</h2>
            <button
              onClick={handleCloseDrawer}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-offWhite hover:bg-surfaceMuted/50 active:scale-95 transition-all touch-manipulation"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar overflow-x-visible px-4 py-4 relative z-0" style={{ paddingBottom: '80px' }}>
            {serverClicked ? (
              <Channels />
            ) : (
              <DirectMessagesList
                setRoom={(id) => {
                  setRoom(id);
                  handleCloseDrawer();
                }}
                directMessages={directMessages}
              />
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-[100] flex items-center justify-between gap-2 border-t border-borderMuted/60 bg-surface/95 px-3 py-2.5 shadow-inner-card sm:gap-3 sm:px-4 sm:py-3" style={{ zIndex: 100 }}>
            <div className="flex items-center gap-2 text-xs font-medium text-offWhite min-w-0 sm:gap-3 sm:text-sm">
              <img
                className="h-8 w-8 min-h-[2rem] min-w-[2rem] rounded-full object-cover shadow-soft-card shrink-0 sm:h-9 sm:w-9"
                src={
                  profileImageUrl ||
                  `https://api.dicebear.com/5.x/identicon/svg?seed=${encodeURIComponent(
                    displayUser?.username || "Guest"
                  )}&backgroundType=gradientLinear`
                }
                alt={`${displayUser?.username || "Guest"} avatar`}
              />
              <span className="truncate">{displayUser?.username || "Guest"}</span>
            </div>
            <div className="shrink-0">
              <Logout />
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default MidSection;
