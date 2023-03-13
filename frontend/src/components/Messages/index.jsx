import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../store/messages";
import { getDmMessages } from "../../store/messages";
import { io } from "socket.io-client";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";

const isProduction = process.env.NODE_ENV === "production";
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
      <div className="p-3 flex flex-col w-full max-w-full max-h-[92%] overflow-auto">
        {messages.map((message) => {
          const { sender } = message;
          console.log(message.image);
          const newDate = Date.parse(message.updatedAt);
          const formattedDate = format(
            new Date(newDate),
            "MM/dd/yyyy hh:mm aa",
            { timeZone }
          );
          return (
            <div key={message.id} className="my-2 flex gap-4 items-center">
              <div>
                <img
                  className="w-10 h-10 rounded-full"
                  src={
                    !message.image
                      ? `https://api.dicebear.com/5.x/identicon/svg?seed=Aneka&backgroundType=gradientLinear`
                      : message.image
                  }
                  alt="avatar"
                />
              </div>
              <div>
                <div className="flex gap-2 items-center">
                  <span className="text-offWhite pb-1">
                    {sender.alias || sender.username}
                  </span>
                  <span className="text-lightGray text-xs">
                    {formattedDate}
                  </span>
                </div>
                <p className="text-offWhite">{message.message}</p>
              </div>
            </div>
          );
        })}
        {/* <p className="text-offWhite">{messageReceived}</p> */}
      </div>
      <form className="fixed bottom-6 w-[95%] max-w-full" onSubmit={send}>
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
