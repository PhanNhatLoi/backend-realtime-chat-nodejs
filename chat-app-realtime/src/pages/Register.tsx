// using MUI and formik for UI and submit form
// using yup check validate value
import { Formik } from "formik";
import { useState } from "react";
import MUILoadingButton from "../components/MUI/LoadingButton";
import * as Yup from "yup";
import MUITextField from "../components/MUI/MUITextField";
import { SERVER_URL } from "../config/constant";
import axios from "axios";
import { useDispatch } from "react-redux";
import { dispatchLogin } from "../redux/actions/authAction";
import { useNavigate } from "react-router-dom";
import { PATH } from "../components/routerPath";

const Register = () => {
  // const
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // state
  const [loading, setLoading] = useState<boolean>(false); //loading action submit

  const schema = Yup.object({
    email: Yup.string().required(),
    name: Yup.string().required(),
    password: Yup.string().required().min(6),
  });
  return (
    <div className="h-screen w-screen flex flex-wrap justify-center p-10">
      <div className="w-full flex flex-wrap justify-center">
        <Formik
          validationSchema={schema}
          initialValues={{ email: "", name: "", password: "" }}
          onSubmit={async (values, actions) => {
            setLoading(true);
            try {
              const res = await axios.post(`${SERVER_URL}/user/register`, {
                email: values.email,
                name: values.name,
                password: values.password,
              });
              if (res) {
                axios
                  .post(`${SERVER_URL}/user/login`, {
                    email: values.email,
                    password: values.password,
                  })
                  .then((res: any) => {
                    dispatch(dispatchLogin(res.data._token));
                  });
              }
            } catch (error: any) {
              actions.setErrors(error.response.data.errors);
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ handleSubmit, setFieldValue, errors }) => (
            <div className="w-full md:w-2/5">
              <div className="font-bold text-3xl text-center mb-10">
                <span>Register</span>
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
                  label="Name"
                  onChange={(val) => setFieldValue("name", val)}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
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
                  Register
                </MUILoadingButton>
                <MUILoadingButton
                  variant="text"
                  loading={loading}
                  onClick={() => {
                    navigate(PATH.LOGIN);
                  }}
                >
                  Login?
                </MUILoadingButton>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
