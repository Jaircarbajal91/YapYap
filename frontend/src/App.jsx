import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
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
import MidSection from "./components/MidSection";
import Messages from "./components/Messages";
import LoadingAnimation from "./components/LoadingAnimation";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [serverClicked, setServerClicked] = useState(false);
  const [activeDmId, setActiveDmId] = useState(null);

  const messages = Object.values(useSelector((state) => state.messages));

  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoaded) {
      // Restore CSRF token first before any other API calls
      restoreCSRF().then(() => {
        setTimeout(() => {
          dispatch(restoreUser()).then(() => {
            setIsLoaded(true);
            dispatch(fetchAllUsers());
            dispatch(fetchFriends());
          });
        }, 2000);
      });
    }
  }, [dispatch]);

  return isLoaded ? (
    <div className="App relative flex h-screen w-full flex-col bg-transparent md:flex-row overflow-hidden">
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
          <div className="flex-1 flex flex-col min-h-0">
            <Messages
              room={activeDmId ? `dm-${activeDmId}` : null}
              dmId={activeDmId}
              messages={messages}
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
