import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productDetailsReducer,
  productListReducer,
} from "./reducers/productReducers";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  usersListReducer
} from "./reducers/userReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  myOrdersListReducer,
} from "./reducers/orderReducers";

const reducer = combineReducers({
  //whatever I called it in the state from the reducer, I just call it the same in the reduers here,
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userLogin: userLoginReducer, //after we add the reducer to the store we movew to the actions folder
  userRegister: userRegisterReducer, //we don't do anything here for this reducer & we then move to the next redux step, the action creator file
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  usersList: usersListReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  myOrdersList: myOrdersListReducer,

}); //having different reducers helps debug

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const initialState = {
  cart: {
    //this is the cart state, so if you type in your address & then go to another screen & then go back to the shipping address, your address'll still be there from local storage
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage }, //if the data's there, it'll always come from local storage w/ this initial state
}; // if you want something to be loaded initially when the redux store loads, we can put it in here

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
); //in applyMiddleware we could just pass in thunk() but we do this instead

export default store;
//after you place the reducer you created in the store, go to the action creators to work on that
