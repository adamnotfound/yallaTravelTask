import { CHANGE_COMPONENT, SET_LOGGED_IN, SET_USERS, SET_USER } from "../types";
import JWT from "expo-jwt";

const initialState = {
  currentComponent: "profileInfo",
  loggedIn: false,
  isLoading: false,
  currentUser: {},
  error: null,
  users: [],
  user: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGGED_IN:
      return {
        ...state,
        loggedIn: action.payload,
      };
    case CHANGE_COMPONENT:
      return {
        ...state,
        currentComponent: action.payload,
      };
    case SET_USERS:
      return {
        ...state,
        users: action.payload,
        currentUser: action.payload.filter(
          (u) =>
            u._id ===
            JWT.decode(
              localStorage.getItem("token"),
              process.env.REACT_APP_JWT_SECRET
            )._id
        )[0],
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
