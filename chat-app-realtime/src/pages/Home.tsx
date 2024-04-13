import React from "react";
import MUILoadingButton from "../components/MUI/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { dispatchLogout } from "../redux/actions/authAction";
import { styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PATH } from "../components/routerPath";

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

const ContainerStyled = styled("div")(
  () => `
  width: 100%;
  padding: 10px;
  span {
    display: block;
  }
`
);

const Home = () => {
  // const
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  return (
    <div className="w-screen h-screen flex flex-wrap justify-center items-center text-center">
      <HeaderStyled>
        {user ? (
          <MUILoadingButton
            onClick={() => {
              dispatch(dispatchLogout());
            }}
          >
            Logout
          </MUILoadingButton>
        ) : (
          <MUILoadingButton
            onClick={() => {
              navigate(PATH.LOGIN);
            }}
          >
            Login
          </MUILoadingButton>
        )}
      </HeaderStyled>
      {user ? (
        <ContainerStyled>
          <span className="text-3xl">This is Home Page</span>
          <span>Hello user {user.name}</span>
          <MUILoadingButton
            onClick={() => {
              navigate(PATH.CHAT);
            }}
          >
            Go to chat
          </MUILoadingButton>
        </ContainerStyled>
      ) : (
        <ContainerStyled>
          <span className="text-3xl">This is Home Page</span>
          <span>You are not logged in!</span>
          <MUILoadingButton
            onClick={() => {
              navigate(PATH.LOGIN);
            }}
          >
            Login to chat
          </MUILoadingButton>
        </ContainerStyled>
      )}
    </div>
  );
};

export default Home;
