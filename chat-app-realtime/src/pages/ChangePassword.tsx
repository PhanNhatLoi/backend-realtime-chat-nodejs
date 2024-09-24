import MUILoadingButton from "../components/MUI/LoadingButton";
import { useSelector } from "react-redux";
import { styled } from "@mui/material";
import AccountMenu from "../components/Messenger/Sidebar/AccountMenu";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import MUITextField from "../components/MUI/MUITextField";
import ImageUpload from "../components/ImageUpload";
import axios from "axios";
import { SERVER_URL } from "../config/constant";

const HeaderStyled = styled("div")(
  () => `
  width: 100%;
  height: 60px;
  padding: 10px;
  background: black;
  position: fixed;
  top: 0;
  display: flex;

`
);

const ChangePassword = () => {
  // const
  const auth = useSelector((state: any) => state.auth);
  const { user, token } = auth;
  const [loading, setLoading] = useState<boolean>(false); //loading action submit

  const schema = Yup.object({
    password: Yup.string().required().min(6),
    confirmPassword: Yup.string()
      .required("required field".toString())
      .when("password", {
        is: (val: string) => (val && val.length > 0 ? true : false),
        then: () =>
          Yup.string().oneOf(
            [Yup.ref("password")],
            "pass not match".toString()
          ),
      }),
  });
  return (
    <div className="w-screen flex flex-wrap justify-center text-center mt-28">
      <HeaderStyled>
        <AccountMenu source={user.avatar} transform="left" />
      </HeaderStyled>
      <Formik
        validationSchema={schema}
        initialValues={{
          password: "",
          confirmPassword: "",
          currentPassword: "",
        }}
        onSubmit={async (values, actions) => {
          setLoading(true);
          axios
            .put(
              `${SERVER_URL}/user/change_password`,
              {
                currentPassword: values.currentPassword,
                password: values.password,
              },
              {
                headers: {
                  Authorization: "Bearer " + token,
                },
              }
            )
            .catch((err) => actions.setErrors(err.response.data.errors))
            .finally(() => {
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            });
        }}
      >
        {({ handleSubmit, setFieldValue, errors, touched }) => (
          <div className="w-full md:w-2/5">
            <div className="font-bold text-3xl text-center mb-10">
              <span>Change Password</span>
            </div>

            <div className="w-full mb-2">
              <MUITextField
                label="Current Password"
                onChange={(val) => setFieldValue("currentPassword", val)}
                error={Boolean(
                  touched.currentPassword && errors.currentPassword
                )}
                helperText={touched.currentPassword && errors.currentPassword}
                type="password"
              />
            </div>

            <div className="w-full mb-2">
              <MUITextField
                label="New Password"
                onChange={(val) => setFieldValue("password", val)}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                type="password"
              />
            </div>

            <div className="w-full mb-2">
              <MUITextField
                label="Confirm Password"
                onChange={(val) => setFieldValue("confirmPassword", val)}
                error={Boolean(
                  touched.confirmPassword && errors.confirmPassword
                )}
                helperText={touched.confirmPassword && errors.confirmPassword}
                type="password"
              />
            </div>

            <div className="flex justify-between">
              <MUILoadingButton loading={loading} onClick={handleSubmit}>
                Change
              </MUILoadingButton>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default ChangePassword;
