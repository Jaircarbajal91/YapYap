import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const GET_ALL_USERS = "session/getAllUsers";
const SET_FRIENDS = "session/setFriends";
const ADD_FRIEND = "session/addFriend";
const REMOVE_FRIEND = "session/removeFriend";

const getAllUsers = users => {
	return {
		type: GET_ALL_USERS,
		payload: users,
	};
};

const setUser = user => {
	return {
		type: SET_USER,
		payload: user,
	};
};

const removeUser = () => {
	return {
		type: REMOVE_USER,
	};
};

const setFriends = (friends) => {
	return {
		type: SET_FRIENDS,
		payload: friends,
	};
};

const addFriend = (friend) => {
	return {
		type: ADD_FRIEND,
		payload: friend,
	};
};

const removeFriend = (friendId) => {
	return {
		type: REMOVE_FRIEND,
		payload: friendId,
	};
};

export const fetchAllUsers = () => async dispatch => {
	const response = await csrfFetch("/api/session/users");
	const data = await response.json();
	dispatch(getAllUsers(data));
	return response;
};

export const login = user => async dispatch => {
	const { credential, password } = user;
	const response = await csrfFetch("/api/session/login", {
		method: "POST",
		body: JSON.stringify({
			credential,
			password,
		}),
	});
	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return response;
	}
	return response;
};

export const restoreUser = () => async dispatch => {
	const response = await csrfFetch("/api/session/restore");
	const data = await response.json();
	dispatch(setUser(data.user));
	return response.arrayBuffer;
};

export const signupUser = user => async dispatch => {
	const { alias, email, password, username, imageId } = user;
	const response = await csrfFetch("api/users/signup", {
		method: "POST",
		body: JSON.stringify({
			username,
			password,
			email,
			alias,
			imageId,
		}),
	});
	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return response;
	}
	return response
};

export const logout = () => async dispatch => {
	const response = await csrfFetch("/api/session/delete", {
		method: "DELETE",
	});
	dispatch(removeUser());
	return response;
};

export const fetchFriends = () => async dispatch => {
	const response = await csrfFetch("/api/friends");
	if (response.ok) {
		const data = await response.json();
		dispatch(setFriends(data));
	}
	return response;
};

export const addFriendAction = (friendId) => async dispatch => {
	const response = await csrfFetch("/api/friends", {
		method: "POST",
		body: JSON.stringify({ friendId }),
	});
	if (response.ok) {
		const data = await response.json();
		dispatch(addFriend(data));
	}
	return response;
};

export const removeFriendAction = (friendId) => async dispatch => {
	const response = await csrfFetch(`/api/friends/${friendId}`, {
		method: "DELETE",
	});
	if (response.ok) {
		dispatch(removeFriend(friendId));
	}
	return response;
};

export const fetchNonFriends = () => async dispatch => {
	try {
		const response = await csrfFetch("/api/friends/non-friends");
		if (response.ok) {
			const data = await response.json();
			console.log("API returned non-friends:", data);
			return data;
		} else {
			const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
			console.error("Error fetching non-friends:", response.status, errorData);
			return [];
		}
	} catch (error) {
		console.error("Exception fetching non-friends:", error);
		return [];
	}
};

const initialState = { user: null, users: [], friends: [] };

const sessionReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_USER: {
			let newState;
			newState = Object.assign({}, state);
			newState.user = action.payload;
			return newState;
		}
		case REMOVE_USER: {
			let newState;
			newState = Object.assign({}, state);
			newState.user = null;
			return newState;
		}
		case GET_ALL_USERS: {
			let newState;
			newState = Object.assign({}, state);
			newState.users = action.payload;
			return newState;
		}
		case SET_FRIENDS: {
			let newState;
			newState = Object.assign({}, state);
			newState.friends = action.payload;
			return newState;
		}
		case ADD_FRIEND: {
			let newState;
			newState = Object.assign({}, state);
			if (!newState.friends.find(f => f.id === action.payload.id)) {
				newState.friends = [...newState.friends, action.payload];
			}
			return newState;
		}
		case REMOVE_FRIEND: {
			let newState;
			newState = Object.assign({}, state);
			newState.friends = newState.friends.filter(f => f.id !== action.payload);
			return newState;
		}
		default: {
			return state;
		}
	}
};

export default sessionReducer;
