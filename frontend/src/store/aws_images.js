import { csrfFetch } from "./csrf";

const SET_IMAGES = "images/setImages";
const ADD_IMAGE = "images/addImage";

const addImage = image => {
  return {
    type: ADD_IMAGE,
    payload: image,
  };
};


export const getImages = () => async dispatch => {
  const response = await csrfFetch("/api/images");
  const data = await response.json();
  if (response.ok) {
    dispatch(setImages(data.images));
  }
};

export const addSingleImage = (image) => async dispatch => {
  const formData = new FormData();
  if (image) formData.append("image", image);
	const response = await csrfFetch("/api/images", {
		method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
	});
	const data = await response.json();
  console.log(data)
	if (response.ok) {
    dispatch(addImage(data.image));
  }
};

const initialState = {};
const imagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IMAGES: {
      const newState = {};
      action.payload.forEach(image => {
        newState[image.id] = image;
      });
      return newState;
    }
    case ADD_IMAGE: {
      const newState = { ...state };
      newState[action.payload.id] = action.payload;
      return newState;
    }
    default:
      return state;
  }
}

export default imagesReducer;
