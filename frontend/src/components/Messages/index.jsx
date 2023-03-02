import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../store/messages";
import { io } from "socket.io-client";

export default function Messages({ messages, channelId, dmId, imageId }) {
  // const messages = Object.values(useSelector(state => state.messages));
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const socket = io();
  const [socketConnected, setSocketConnected] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // create socket connection
  useEffect(() => {
    socket.on("connection", () => {
      setSocketConnected(true);
      console.log("socket connected");
    });
    return () => {
      socket.off("connection");
      setSocketConnected(false);
    };
  }, [socket, send]);

  function send(e) {
    e.preventDefault();
    socket.emit("chatMessage", newMessage);
    // console.log(message)
    dispatch(
      sendMessage(newMessage, sessionUser.id, { channelId, dmId, imageId })
    );
    setNewMessage("");
  }

  return (
    <div className="relative p-5 bg-chatBg w-full min-h-screen max-h-screen overflow-auto">
      <div className="p-3 flex flex-col">
        {messages.map((message) => {
          return (
            <p className="text-offWhite" key={message.id}>
              {message.message}
            </p>
          );
        })}
      </div>
      <form className="absolute bottom-6 w-[97%]" onSubmit={send}>
        <input
          type="text"
          value={newMessage}
          className=" p-2 rounded-lg w-full bg-demoButton outline-none caret-lightGray px-4 text-lightGray"
          onChange={(e) => setNewMessage(e.target.value)}
        />
      </form>
    </div>
  );
}
