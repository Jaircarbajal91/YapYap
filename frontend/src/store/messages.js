import { csrfFetch } from "./csrf";
const Heap = require("mnemonist/heap")

const SET_MESSAGES = "messages/setMessages";
const ADD_MESSAGE = "messages/addMessage";
const REMOVE_MESSAGE = "messages/removeMessage";
const UPDATE_MESSAGE = "messages/updateMessage";

const setMessages = messages => {
	return {
		type: SET_MESSAGES,
		payload: messages,
	};
};

const addMessage = message => {
    return {
        type: ADD_MESSAGE,
        payload: message,
    }
}


const getMessages = channelId => async dispatch => {
    const response = await csrfFetch(`/api/channels/channelId`);
    const data = await response.json();
    if (response.ok) {
        dispatch(setMessages(data.Messages));
    }
}





const initialState = {};
const messagesReducer = (state = initialState, action) => {
    switch (action.payload) {
        case SET_MESSAGES: {
            const newState = {};
            action.payload.forEach(message => {
                newState[message.id] = message;
            });
            console.log(newState)
        }
    }
}

export default messagesReducer;
