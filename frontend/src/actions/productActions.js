import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../constants/productConstants";
//think of these as action creators & the constants as actions
//what we did w/ useEffect before to fetch, we now do here

//here's where redux-thunk comes in to allow us to add a function w/i a function w/ dispach an async request
export const listProducts = () => async (dispatch) => {
  try {
    //1st we dispatch the request:
    dispatch({ type: PRODUCT_LIST_REQUEST });

    //now we make our request:
    const { data } = await axios.get("/api/products"); //this should give us the data

    //now we dispatch the PRODUCT_LIST_SUCCESS:
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data, //if it succeeds, the products array from the productReducers'll be filled w/ the data
    }); //if it fails it'll fire off in the catch below
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message, //this'll give us our custom message from the error handler we made or a generic error message
    });
  }
  //now we need to fire this action creator off in the HomeScreen component
};

export const listProductDetails = (id) => async (dispatch) => {
  try {
    //1st we dispatch the request:
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    //now we make our request:
    const { data } = await axios.get(`/api/products/${id}`); //this should give us the data

    //now we dispatch the PRODUCT_DETAILS_SUCCESS:
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data, //if it succeeds, the products array from the productReducers'll be filled w/ the data
    }); //if it fails it'll fire off in the catch below
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message, //this'll give us our custom message from the error handler we made or a generic error message
    });
  }
  //now we need to fire this action creator off in the HomeScreen component
};
//once you finish the action creator here, then you can go to your component (in the screens) to import & work on that