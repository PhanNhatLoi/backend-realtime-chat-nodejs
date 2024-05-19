import { BrowserRouter as Router } from "react-router-dom";
import Body from "./components/Body";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL, pusher_cluster, pusher_key } from "./config/constant";
import { dispatchGetUser, dispatchLogout } from "./redux/actions/authAction";
import Pusher from "pusher-js";

function App() {
  // store value
  const auth = useSelector((state: any) => state.auth);
  const { token, user } = auth;

  // const
  const dispatch = useDispatch();

  const getUser = async () => {
    axios
      .get(`${SERVER_URL}/user/infor`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        dispatch(dispatchGetUser(res));
      })
      .catch(() => {
        dispatch(dispatchLogout());
      });
  };

  useEffect(() => {
    if (user?._id) {
      const pusher = new Pusher(pusher_key, {
        cluster: pusher_cluster,
        channelAuthorization: {
          endpoint: SERVER_URL,
          transport: "ajax",
        },
      });
      const channelUser = pusher.subscribe(user._id);

      // event update info from user
      channelUser.bind("user-update", () => {
        getUser();
      });

      // event user change password
      channelUser.bind("user-change-password", () => {
        alert("user just change the password, login again!");
        dispatch(dispatchLogout());
      });

      return () => {
        pusher.unsubscribe(user._id);
        pusher.disconnect();
      };
    }
  }, [user]);

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
