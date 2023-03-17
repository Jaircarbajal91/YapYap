import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAllChannelsForServer } from '../../store/channels';
import { getMessages } from '../../store/messages';
import Channels from '../Channels/ChannelForm';
import ChannelModal from '../Channels/ChannelModal';
import Messages from '../Messages';

export default function ServerDetails({ sessionUser }) {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    const server = useSelector(state => state.servers[serverId]);
    const server_name = server?.server_name;
    const channelsObj = useSelector(state => state.channels);
    const channels = Object.values(channelsObj);
    const messages = Object.values(useSelector(state => state.messages));
    const [channelId, setChannelId] = useState(null);
    const [messagesLoaded, setMessagesLoaded] = useState([]);

    // fetches channels for selected server
    useEffect(() => {
        dispatch(getAllChannelsForServer(serverId));
    },[serverId])

    async function selectChannel(e) {
        e.preventDefault();
        // display the messages of the channel that was clicked
        setChannelId(e.currentTarget.id);
        const messages = await dispatch(getMessages(e.currentTarget.id));
        setMessagesLoaded(messages);
    }

  return (
    <div className="App flex relative w-full">
      <div className="relative scrollbar z-0 min-w-[18em] w-[18em] max-w-[18em] py-2 px-3 min-h-screen max-h-screen overflow-auto bg-midGray flex flex-col items-start">
        <h1 className="w-full text-offWhite text-lg ml-1 mb-5">
          {server_name}
        </h1>
        <div className="flex w-full justify-between">
          <h1 className="text-offWhite text-lg ml-1">Text Channels</h1>
          <ChannelModal formType='Create'/>
        </div>
        {channels &&
          channels.map((channel) => {
            return (
              <div
                key={channel.id}
                id={channel.id}
                // make the button active if it is the selected channel
                className={`w-full flex justify-between text-offWhite text-left text-sm mb-1 pl-4 hover:bg-darkGray cursor-pointer rounded min-h-fit h-8 ${
                  channelId === channel.id ? 'bg-darkGray text-bold' : ''
                }`}
                onClick={selectChannel}
              >
                <div
                  className='mt-1'
                >
                  # {channel.channel_name}
                </div>
                <ChannelModal channel={channel} formType='Update' />
              </div>
            );
          })}
      </div>
      <div className="bg-chatBg w-full">
        {messages.length > 0 && (
          <Messages messages={messages} channelId={channelId} />
        )}
      </div>
    </div>
  );
}
