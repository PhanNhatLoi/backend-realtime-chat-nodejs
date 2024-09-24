import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { PATH } from "./routerPath";

const AuthRoutes = () => {
  return (
    <section>
      <Routes>
        <Route path={PATH.LOGIN} element={<Login />} />
        <Route path={PATH.REGISTER} element={<Register />} />
        <Route path="*" element={<Navigate to={PATH.LOGIN} />} />
      </Routes>
    </section>
  );
};

export default AuthRoutes;
