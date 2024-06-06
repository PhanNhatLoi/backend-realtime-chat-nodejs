// using MUI and formik for UI and submit form
// using yup check validate value
import { Formik } from "formik";
import { useContext, useState } from "react";
import MUILoadingButton from "../components/MUI/LoadingButton";
import * as Yup from "yup";
import MUITextField from "../components/MUI/MUITextField";
import { SERVER_URL } from "../config/constant";
import axios from "axios";
import { useDispatch } from "react-redux";
import { dispatchLogin } from "../redux/actions/authAction";
import { useNavigate } from "react-router-dom";
import { PATH } from "../components/routerPath";
import { MessagesContext } from "../components/Context/MessagesContext";

const LoginPage = () => {
  // const
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // state
  const [loading, setLoading] = useState<boolean>(false); //loading action submit

  const { chooseUserChatting } = useContext(MessagesContext);

  const schema = Yup.object({
    email: Yup.string().required(),
    password: Yup.string().required().min(6),
  });

  return (
    <div className="h-screen w-screen flex flex-wrap justify-center p-10">
      <div className="w-full flex flex-wrap justify-center">
        <Formik
          validationSchema={schema}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values, actions) => {
            setLoading(true);
            axios
              .post(`http://192.168.1.208:8000/auth/sign-in`, {
                // .post(`${SERVER_URL}/user/login`, {
                email: values.email,
                password: values.password,
              })
              .then((res) => {
                chooseUserChatting(undefined);
                dispatch(dispatchLogin(res.data._token));
              })
              .catch((err) => actions.setErrors(err.response.data.errors))
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          {({ handleSubmit, setFieldValue, errors }) => (
            <div className="w-full md:w-2/5">
              <div className="font-bold text-3xl text-center mb-10">
                <span>Login</span>
              </div>
              <div className="w-full mb-2">
                <MUITextField
                  label="Email"
                  onChange={(val) => setFieldValue("email", val)}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
              </div>

              <div className="w-full mb-2">
                <MUITextField
                  label="Password"
                  onChange={(val) => setFieldValue("password", val)}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  type="password"
                />
              </div>
              <div className="flex justify-between">
                <MUILoadingButton loading={loading} onClick={handleSubmit}>
                  Login
                </MUILoadingButton>
                <MUILoadingButton
                  variant="text"
                  loading={loading}
                  onClick={() => {
                    navigate(PATH.REGISTER);
                  }}
                >
                  Register
                </MUILoadingButton>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
