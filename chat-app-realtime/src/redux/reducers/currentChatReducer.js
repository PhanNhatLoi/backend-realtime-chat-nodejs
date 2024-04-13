import ACTIONS from "../actions/";

const currentChat = [];

const currentChatReducer = (state = currentChat, action) => {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_CHAT:
      return action.payload.user;
    default:
      return state;
  }
};

export default currentChatReducer;
