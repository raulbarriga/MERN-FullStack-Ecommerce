import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_DETAILS_RESET,
  USERS_LIST_FAIL,
  USERS_LIST_SUCCESS,
  USERS_LIST_REQUEST,
} from "../constants/userConstants";

export const userLoginReducer = (state = {}, action) => {
  //to evaluate the action type, we use a switch:
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        loading: true,
      };
    case USER_LOGIN_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload,
      };
    case USER_LOGIN_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

//after we creater this reducer, we have to add it to the store

export const userRegisterReducer = (state = {}, action) => {
  //a pretty simple register reducer
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return {
        loading: true,
      };
    case USER_REGISTER_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload,
      };
    case USER_REGISTER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const userDetailsReducer = (state = { user: {} }, action) => {
  //a profile details reducer
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case USER_DETAILS_SUCCESS:
      return {
        loading: false,
        user: action.payload,
      };
    case USER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case USER_DETAILS_RESET:
      return {
        user: {},
      };
    default:
      return state;
  }
}; //next, add it to the store

export const userUpdateProfileReducer = (state = {}, action) => {
  //a profile update reducer
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return {
        loading: true,
      };
    case USER_UPDATE_PROFILE_SUCCESS:
      return {
        loading: false,
        success: true,
        userInfo: action.payload,
      };
    case USER_UPDATE_PROFILE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    // case USER_UPDATE_PROFILE_RESET:
    //   return {
    //     loading: false,
    //     error: action.payload,
    //   };
    default:
      return state;
  }
};

export const usersListReducer = (state = { users: [] }, action) => {
  //a profile update reducer
  switch (action.type) {
    case USERS_LIST_REQUEST:
      return {
        loading: true,
      };
    case USERS_LIST_SUCCESS:
      return {
        loading: false,
        users: action.payload,
      };
    case USERS_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
