import { csrfFetch } from "./csrf";

const SET_SERVERS = "servers/setServers";
const ADD_SERVER = "servers/addServer";
const REMOVE_SERVER = "servers/removeServer";
const UPDATE_SERVER = "servers/updateServer";

const setServers = servers => {
	return {
		type: SET_SERVERS,
		payload: servers,
	};
};

const addServer = server => {
	return {
		type: ADD_SERVER,
		payload: server,
	};
};

const removeServer = serverId => {
	return {
		type: REMOVE_SERVER,
		payload: serverId,
	};
};

const updateServer = server => {
	return {
		type: UPDATE_SERVER,
		payload: server,
	};
};

export const getServers = () => async dispatch => {
	const response = await csrfFetch("/api/servers");
	const data = await response.json();
	if (response.ok) {
		dispatch(setServers(data.Servers));
		return response;
	}
};

export const createServer = server => async dispatch => {
	const { server_name, imageId } = server;
	const response = await csrfFetch("/api/servers/create", {
		method: "POST",
		body: JSON.stringify({
			server_name,
			imageId,
		}),
	});
	if (response.ok) {
		const data = await response.json();
		dispatch(addServer(data));
		return response;
	}
};

export const deleteServer = serverId => async dispatch => {
	const response = await csrfFetch(`/api/servers/delete/${serverId}`, {
		method: "DELETE",
	});
	if (response.ok) {
		dispatch(removeServer(serverId));
		return response;
	}
};

export const editServer = server => async dispatch => {
	const { server_name, imageId, serverId } = server;
	const response = await csrfFetch(`/api/servers/edit/${serverId}`, {
		method: "PUT",
		body: JSON.stringify({
			server_name,
			imageId,
		}),
	});
	if (response.ok) {
		const data = await response.json();
		dispatch(updateServer(data));
		return response;
	}
};

const initialState = {};
const serversReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_SERVERS: {
			const newState = {};
			action.payload.forEach(server => {
				newState[server.id] = server;
			});
			return newState;
		}
		case ADD_SERVER: {
			const newState = { ...state };
			newState[action.payload.id] = action.payload;
			return newState;
		}
		case REMOVE_SERVER: {
			const newState = { ...state };
			delete newState[action.payload];
			return newState;
		}
		case UPDATE_SERVER: {
			const newState = { ...state };
			newState[action.payload.id] = action.payload;
			return newState;
		}
		default:
			return state;
	}
};

export default serversReducer;
