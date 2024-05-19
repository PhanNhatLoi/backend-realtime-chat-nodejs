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
  justify-content: end;

`
);

const Profile = () => {
  // const
  const auth = useSelector((state: any) => state.auth);
  const { user, token } = auth;
  const [loading, setLoading] = useState<boolean>(false); //loading action submit

  const schema = Yup.object({
    name: Yup.string().required(),
  });
  return (
    <div className="w-screen flex flex-wrap justify-center text-center mt-28">
      <HeaderStyled>
        <AccountMenu source={user.avatar} transform="right" />
      </HeaderStyled>
      <Formik
        validationSchema={schema}
        initialValues={{ name: user.name || "", avatar: user.avatar || "" }}
        onSubmit={async (values, actions) => {
          setLoading(true);
          axios
            .patch(
              `${SERVER_URL}/user/update`,
              {
                name: values.name,
                avatar: values.avatar,
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
        {({ handleSubmit, setFieldValue, errors, values }) => (
          <div className="w-full md:w-2/5">
            <div className="font-bold text-3xl text-center mb-10">
              <span>Profile</span>
            </div>
            <div className="mb-10">
              <ImageUpload
                source={values.avatar}
                onChange={(val) => setFieldValue("avatar", val)}
              />
            </div>
            <div className="w-full mb-2">
              <MUITextField
                label="Name"
                onChange={(val) => setFieldValue("name", val)}
                error={Boolean(errors.name)}
                helperText={errors.name?.toString()}
                value={values.name}
              />
            </div>

            <div className="flex justify-between">
              <MUILoadingButton loading={loading} onClick={handleSubmit}>
                Update
              </MUILoadingButton>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default Profile;
