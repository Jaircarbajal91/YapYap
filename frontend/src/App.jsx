import React, { useState, useEffect, useRef } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { restoreUser, fetchAllUsers, fetchFriends } from "./store/session";
import { restoreCSRF } from "./store/csrf";
import LoginForm from "./auth/LoginForm";
import Logout from "./auth/Logout";
import Splash from "./components/splash";
import Server from "./components/Server";
import Servers from "./components/Servers";
import Channels from "./components/Channels/ChannelForm";
import { getServers } from "./store/servers";
import ProtectedRoute from "./components/ProtectedRoute";
import SignupForm from "./auth/SignupForm";
import MidSection, { MidSectionMobile } from "./components/MidSection";
import Messages from "./components/Messages";
import LoadingAnimation from "./components/LoadingAnimation";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [serverClicked, setServerClicked] = useState(false);
  const [activeDmId, setActiveDmId] = useState(null);
  const [openDMDrawer, setOpenDMDrawer] = useState(false);
  const [isDMDrawerOpen, setIsDMDrawerOpen] = useState(false);
  const location = useLocation();

  const messages = Object.values(useSelector((state) => state.messages));

  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  
  // Check if we're on an app route that needs overflow-hidden
  const isAppRoute = location.pathname.startsWith('/app');
  
  useEffect(() => {
    if (!isLoaded) {
      // Restore CSRF token first before any other API calls
      // In production, CSRF token is already set via cookies
      restoreCSRF().then(() => {
        setTimeout(async () => {
          const restoreData = await dispatch(restoreUser());
          setIsLoaded(true);
          // Only fetch data if user is logged in
          if (restoreData?.user) {
            dispatch(fetchAllUsers());
            dispatch(fetchFriends());
          }
        }, 2000);
      }).catch(() => {
        // If CSRF restore fails (e.g., in production where endpoint doesn't exist),
        // continue anyway since token might already be in cookies
        setTimeout(async () => {
          const restoreData = await dispatch(restoreUser());
          setIsLoaded(true);
          if (restoreData?.user) {
            dispatch(fetchAllUsers());
            dispatch(fetchFriends());
          }
        }, 2000);
      });
    }
  }, [dispatch]);

  // Mobile App Header Component for /app route
  const MobileAppHeader = ({ sessionUser, activeDmId, onOpenDM }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const images = useSelector((state) => state.images);
    const users = useSelector((state) => state.session.users);
    const currentUser = users?.find((user) => user.id === sessionUser?.id);
    const displayUser = currentUser || sessionUser;

    const profileImageUrl =
      currentUser?.Image?.url ||
      (displayUser?.imageId && images?.[displayUser.imageId]?.url) ||
      null;

    useEffect(() => {
      function handleClickOutside(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsMenuOpen(false);
        }
      }
      if (isMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }, [isMenuOpen]);


    return (
      <div className="md:hidden fixed top-[4rem] left-0 right-0 z-[60] flex items-center gap-2 bg-surfaceLight/95 backdrop-blur-sm border-b border-borderMuted/60 px-3 py-2.5 shadow-soft-card sm:gap-3 sm:px-4 sm:py-3">
        <button
          onClick={onOpenDM}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-offWhite hover:bg-surfaceMuted/50 active:scale-95 transition-all touch-manipulation"
          aria-label="Open direct messages"
          title="Direct Messages"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        <h1 className="text-offWhite text-sm font-semibold flex-1 truncate sm:text-base">
          {activeDmId ? 'Direct Message' : 'Direct Messages'}
        </h1>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-offWhite hover:bg-surfaceMuted/50 active:scale-95 transition-all touch-manipulation"
            aria-label="User menu"
          >
            <img
              className="h-7 w-7 rounded-full object-cover border border-borderMuted/40 sm:h-8 sm:w-8"
              src={
                profileImageUrl ||
                `https://api.dicebear.com/5.x/identicon/svg?seed=${encodeURIComponent(
                  displayUser?.username || "Guest"
                )}&backgroundType=gradientLinear`
              }
              alt={`${displayUser?.username || "Guest"} avatar`}
            />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-11 w-48 rounded-lg border border-borderMuted/60 bg-midGray shadow-soft-card overflow-hidden z-[60]">
              <div className="px-4 py-3 border-b border-borderMuted/60">
                <div className="flex items-center gap-3">
                  <img
                    className="h-10 w-10 rounded-full object-cover border border-borderMuted/40"
                    src={
                      profileImageUrl ||
                      `https://api.dicebear.com/5.x/identicon/svg?seed=${encodeURIComponent(
                        displayUser?.username || "Guest"
                      )}&backgroundType=gradientLinear`
                    }
                    alt={`${displayUser?.username || "Guest"} avatar`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-offWhite truncate">
                      {displayUser?.username || "Guest"}
                    </p>
                    {displayUser?.alias && (
                      <p className="text-xs text-lightGray truncate">
                        {displayUser.alias}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="py-1">
                <div className="px-4 py-2.5">
                  <Logout />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return isLoaded ? (
    <div className={`App relative flex w-full flex-col bg-transparent ${isAppRoute ? 'h-screen md:flex-row overflow-hidden touch-pan-y' : 'min-h-screen'}`}>
      <Switch>
        <Route path="/login" exact={true}>
          <LoginForm sessionUser={sessionUser} />
        </Route>
        <Route path="/register" exact={true}>
          <SignupForm sessionUser={sessionUser} />
        </Route>
        <ProtectedRoute path="/app/:serverId/" exact={true}>
          <Servers sessionUser={sessionUser} />
          <Server sessionUser={sessionUser} />
        </ProtectedRoute>
        <ProtectedRoute path="/app">
          <Servers sessionUser={sessionUser} />
          <MidSection setRoom={setActiveDmId} serverClicked={serverClicked} />
          <MidSectionMobile setRoom={setActiveDmId} serverClicked={serverClicked} activeDmId={activeDmId} openDMDrawer={openDMDrawer} setOpenDMDrawer={setOpenDMDrawer} onDrawerStateChange={setIsDMDrawerOpen} />
          {!activeDmId && !isDMDrawerOpen && <MobileAppHeader sessionUser={sessionUser} activeDmId={activeDmId} onOpenDM={() => setOpenDMDrawer(true)} />}
          <div className="flex-1 flex flex-col min-h-0 w-full">
            <Messages
              room={activeDmId ? `dm-${activeDmId}` : null}
              dmId={activeDmId}
              messages={messages}
              onBack={() => setActiveDmId(null)}
            />
          </div>
        </ProtectedRoute>
        <Route path="/" exact={true}>
          <Splash sessionUser={sessionUser} />
        </Route>
        <Route path="*">Page Not Found</Route>
      </Switch>
    </div>
  ) : (
    <LoadingAnimation />
  );
}

export default App;
