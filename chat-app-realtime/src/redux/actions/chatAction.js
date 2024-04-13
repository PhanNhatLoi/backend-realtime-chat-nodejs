import { UserType } from "@/src/type";
import ACTIONS from "./index";

export const dispatchSetCurrentChat = (res) => {
  return {
    type: ACTIONS.SET_CURRENT_CHAT,
    payload: {
      user: res,
    },
  };
};
