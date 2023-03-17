import { csrfFetch } from "./csrf";

const SET_CHANNELS = "channels/setChannels";
const ADD_CHANNEL = "channels/addChannel";
const UPDATE_CHANNEL = "channels/updateChannel"
const REMOVE_CHANNEL = "channels/removeChannel";

export const setChannelsForServer = channels => {
	return {
		type: SET_CHANNELS,
		payload: channels
	}
}

const addChannel = channel => {
	return {
		type: ADD_CHANNEL,
		payload: channel,
	};
};

const updateChannelAction = channel => {
	return {
		type: UPDATE_CHANNEL,
		payload: channel
	}
}

const removeChannel = channelId => {
	return {
		type: REMOVE_CHANNEL,
		payload: channelId,
	};
};

export const getAllChannelsForServer = (serverId) => async (dispatch) => {
	const response = await csrfFetch(`/api/servers/${serverId}/channels`)

	const data = await response.json()
	if (response.ok) {
		dispatch(setChannelsForServer(data))
	}
}

export const createChannel = (channel_name, serverId) => async dispatch => {
	const response = await csrfFetch("/api/channels", {
		method: "POST",
		body: JSON.stringify({
			channel_name,
			serverId,
		}),
	});
	const data = await response.json();
	if (response.ok) {
		dispatch(addChannel(data));
	}
};

export const updateChannel = (channelId, channelName) => async (dispatch) => {
	const response = await csrfFetch(`/api/${channelId}`, {
		method: 'PUT',
		body: JSON.stringify({
			channelName
		})
	})
	const data = await response.json()
	if (response.ok) {
		dispatch(updateChannelAction(data))
	}
}

export const deleteChannel = channelId => async dispatch => {
	const response = await csrfFetch(`/api/channels/${channelId}`, {
		method: "DELETE",
	});
	if (response.ok) {
		dispatch(removeChannel(channelId));
	}
};

const initialState = {};
const channelsReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_CHANNELS: {
			const newState = {};
			action.payload.forEach(channel => {
				newState[channel.id] = channel;
			});
			return newState;
		}
		case ADD_CHANNEL: {
			const newState = { ...state };
			newState[action.payload.id] = action.payload;
			return newState;
		}
		case UPDATE_CHANNEL: {
			const newState = { ...state };
			newState[action.payload.id] = action.payload
			return newState
		}
		case REMOVE_CHANNEL: {
			const newState = { ...state };
			delete newState[action.payload];
			return newState;
		}
		default:
			return state;
	}
};

export default channelsReducer;
