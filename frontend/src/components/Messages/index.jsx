import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../store/messages";
import { getDmMessages } from "../../store/messages";
import { io } from "socket.io-client";

const isProduction = process.env.NODE_ENV === "production";

export default function Messages({ messages, room }) {
  // const messages = Object.values(useSelector(state => state.messages));
  const sessionUser = useSelector((state) => state.session.user);
  const REACT_APP_SOCKET_IO_URL = isProduction
    ? "https://yapyap.herokuapp.com"
    : "http://localhost:8000";
  const socket = io.connect(REACT_APP_SOCKET_IO_URL, { secure: true });
  const dispatch = useDispatch();
  const [socketConnected, setSocketConnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  useEffect(() => {
    if (room !== null) {
      socket.emit("joinRoom", { room });
      setSocketConnected(true);
    }
  }, [room]);

  useEffect(() => {
    socket.on("receivedMessage", (data) => {
      dispatch(getDmMessages(data.dmId));
    });
  }, [socket]);

  function send(e) {
    e.preventDefault();
    socket.emit("chatMessage", {
      newMessage,
      room,
      userId: sessionUser.id,
      dmId: room,
    });
    setNewMessage("");
  }

  return (
    <div className="relative px-5 bg-chatBg max-w-full w-full min-h-screen max-h-screen overflow-auto">
      <div className="p-3 flex flex-col w-full max-w-full">
        {messages.map((message) => {
          return (
            <p key={message.id} className="text-offWhite">
              {message.message}
            </p>
          );
        })}
        {/* <p className="text-offWhite">{messageReceived}</p> */}
      </div>
      <form className="absolute bottom-6 w-[95%] max-w-full" onSubmit={send}>
        <input
          type="text"
          value={newMessage}
          className=" p-2 rounded-lg max-w-full w-full bg-demoButton outline-none caret-lightGray px-4 text-lightGray"
          onChange={(e) => setNewMessage(e.target.value)}
        />
      </form>
    </div>
  );
}
