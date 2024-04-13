import React from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./reducers";
import { PersistGate } from "redux-persist/lib/integration/react";

function DataProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>loading</div>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

export default DataProvider;
