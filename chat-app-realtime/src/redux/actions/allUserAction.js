import ACTIONS from "./index";

export const dispatchGetAllUser = (res) => {
  return {
    type: ACTIONS.GET_ALL_USERS,
    payload: res.data.user,
  };
};
