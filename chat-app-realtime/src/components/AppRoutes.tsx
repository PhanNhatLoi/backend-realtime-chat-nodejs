import { Navigate, Route, Routes } from "react-router-dom";
import { PATH } from "./routerPath";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile";
import ChangePassword from "../pages/ChangePassword";

const AppRoutes = () => {
  return (
    <section>
      <Routes>
        <Route path={PATH.CHAT} element={<Chat />} />
        <Route path={PATH.PROFILE} element={<Profile />} />
        <Route path={PATH.CHANGE_PASSWORD} element={<ChangePassword />} />
        <Route path="*" element={<Navigate to={PATH.CHAT} />} />
      </Routes>
    </section>
  );
};

export default AppRoutes;
