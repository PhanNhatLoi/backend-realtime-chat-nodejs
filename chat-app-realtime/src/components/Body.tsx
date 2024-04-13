import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import { useSelector } from "react-redux";
import { PATH } from "./routerPath";
import Chat from "../pages/Chat";

const Body = () => {
  const token = useSelector((state: any) => state.auth.token);
  return (
    <section>
      <Routes>
        <Route
          path={PATH.LOGIN}
          element={token ? <Navigate to={PATH.HOME} /> : <Login />}
        />
        <Route
          path={PATH.REGISTER}
          element={token ? <Navigate to={PATH.HOME} /> : <Register />}
        />
        <Route path={PATH.HOME} element={<Home />} />
        <Route
          path={PATH.CHAT}
          element={!token ? <Navigate to={PATH.LOGIN} /> : <Chat />}
        />
        <Route path="*" element={<Navigate to={PATH.HOME} />} />
      </Routes>
    </section>
  );
};

export default Body;
