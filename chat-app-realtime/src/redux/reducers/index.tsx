import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import auth from "./authReducer";
// import users from "./userReducer";
// import currentChat from "./currentChatReducer";

const rootReducer: any = combineReducers({
  auth,
  // users,
  // currentChat,
});

const persistConfig = {
  key: "root",
  storage: storage,
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer);
export const persistor = persistStore(store);
