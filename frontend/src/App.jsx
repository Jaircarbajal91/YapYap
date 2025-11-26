import React, { useState, useEffect } from "react";
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

  return isLoaded ? (
    <div className={`App relative flex w-full flex-col bg-transparent ${isAppRoute ? 'h-screen md:flex-row overflow-hidden' : 'min-h-screen'}`}>
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
          <MidSectionMobile setRoom={setActiveDmId} serverClicked={serverClicked} activeDmId={activeDmId} />
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
