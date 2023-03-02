import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../store/messages";
import { getDmMessages } from "../../store/messages";
import { io } from "socket.io-client";

export default function Messages({ messages, room }) {
  // const messages = Object.values(useSelector(state => state.messages));
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const socket = io.connect("http://localhost:8000");
  const [socketConnected, setSocketConnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  useEffect(() => {
    if (room !== null) {
      socket.emit("joinRoom", { room });
      console.log('room', room)
      setSocketConnected(true);
    }
  }, [room]);

  useEffect(() => {
    socket.on("receivedMessage", (data) => {
      console.log(data);
      dispatch(getDmMessages(data.dmId));
    });
  }, [socket]);



  function send(e) {
    e.preventDefault();
    socket.emit("chatMessage", { newMessage, room, userId: sessionUser.id, dmId: room });
    setNewMessage("");
  }

  return (
    <div className="relative p-5 bg-chatBg w-full min-h-screen max-h-screen overflow-auto">
      <div className="p-3 flex flex-col">
        {messages.map((message) => {
          return (
            <p key={message.id} className="text-offWhite">
              {message.message}
            </p>
          );
        })}
        {/* <p className="text-offWhite">{messageReceived}</p> */}
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
