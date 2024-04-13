import { SERVER_URL } from "../../config/constant";
import ACTIONS from "./index";
import axios from "axios";

export const dispatchLogin = (token: string) => {
  return {
    type: ACTIONS.LOGIN,
    payload: token,
  };
};

export const dispatchLogout = () => {
  return {
    type: ACTIONS.LOGOUT,
  };
};

export const fetchUser = async (token: string) => {
  const res = await axios.get(`${SERVER_URL}/user/infor`, {
    headers: { Authorization: "Bearer " + token },
  });
  return res;
};

export const dispatchGetUser = (res: any) => {
  return {
    type: ACTIONS.GET_USER,
    payload: {
      user: res.data,
    },
  };
};
