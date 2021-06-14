import axios from "axios";
import { CHANGE_COMPONENT, SET_USER, SET_USERS, SET_LOGGED_IN } from "../types";

// Actions
export const changeComponent = (val) => {
  return { type: CHANGE_COMPONENT, payload: val };
};
export const setLoggedIn = (val) => {
  return { type: SET_LOGGED_IN, payload: val };
};
export const setUser = (user) => {
  return { type: SET_USER, payload: user };
};

export const getUsers = () => {
  return (dispatch) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/getall`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) =>
        dispatch({
          type: SET_USERS,
          payload: res.data.data.map((r) => {
            r.fullName = r.firstName + " " + r.lastName;
            return r;
          }),
        })
      )
      .catch((err) => console.log(err));
  };
};
