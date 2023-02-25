import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

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
	const response = await csrfFetch("/api/csrf/restore");
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

const initialState = { user: null };

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
		default: {
			return state;
		}
	}
};

export default sessionReducer;
