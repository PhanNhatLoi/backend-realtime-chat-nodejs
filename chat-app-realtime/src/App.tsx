import { BrowserRouter as Router } from "react-router-dom";
import Body from "./components/Body";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "./config/constant";
import { dispatchGetUser, dispatchLogout } from "./redux/actions/authAction";

function App() {
  // store value
  const token = useSelector((state: any) => state.auth.token);

  // const
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/user/infor`, {
        headers: { Authorization: "Bearer " + token },
      });
      dispatch(dispatchGetUser(res));
    } catch (error) {
      dispatch(dispatchLogout());
    }
  };
  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  return (
    <Router>
      <Body />
    </Router>
  );
}

export default App;
