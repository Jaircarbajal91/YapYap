import { csrfFetch } from "./csrf";

const SET_DIRECT_MESSAGES = "directMessages/setDirectMessages";
const ADD_DIRECT_MESSAGE = "directMessages/addDirectMessage";
const REMOVE_DIRECT_MESSAGE = "directMessages/removeDirectMessage";
const UPDATE_DIRECT_MESSAGE = "directMessages/updateDirectMessage";

const setDirectMessages = directMessages => {
  return {
    type: SET_DIRECT_MESSAGES,
    payload: directMessages,
  };
}

export const addDirectMessage = directMessage => {
  return {
    type: ADD_DIRECT_MESSAGE,
    payload: directMessage,
  };
}

export const removeDirectMessage = (dmId) => {
  return {
    type: REMOVE_DIRECT_MESSAGE,
    payload: dmId,
  };
}

export const getDirectMessages = dmId => async dispatch => {
  const response = await csrfFetch(`/api/directmessages/`);
  const data = await response.json();
  if (response.ok) {
    dispatch(setDirectMessages(data));
  }
  return data;
}

export const createDMRoom = (recipientIds) => async dispatch => {
  console.log("recipientIds", recipientIds)
  const response = await csrfFetch(`/api/directmessages/create`, {
    method: "POST",
    body: JSON.stringify({
      recipientIds,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    dispatch(addDirectMessage(data));
  }
  return data;
}

export const deleteDirectMessage = (dmId) => async dispatch => {
  const response = await csrfFetch(`/api/directmessages/delete/${dmId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(removeDirectMessage(dmId));
  }
  return response;
}

const initialState = {};

const directMessagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DIRECT_MESSAGES: {
      const newState = {};
      action.payload.messages.forEach(directMessage => {
        newState[directMessage.id] = directMessage;
      });
      return newState;
    }
    case ADD_DIRECT_MESSAGE: {
      const newState = { ...state };
      newState[action.payload.id] = action.payload;
      return newState;
    }
    case REMOVE_DIRECT_MESSAGE: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    default:
      return state;
  }
}

export default directMessagesReducer;
