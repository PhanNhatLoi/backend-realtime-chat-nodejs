import ACTIONS from "../actions/";

const initialState = {
  user: null,
  token: "",
};

const authReducer = (
  state = initialState,
  action: { type: any; payload: any }
) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        token: action.payload,
      };
    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: "",
      };
    // case ACTIONS.GET_TOKEN:
    //   return {
    //     ...state,
    //     token: action.payload,
    //   };
    case ACTIONS.GET_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    default:
      return state;
  }
};

export default authReducer;
