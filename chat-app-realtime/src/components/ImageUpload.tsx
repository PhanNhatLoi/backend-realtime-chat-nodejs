import { styled } from "@mui/material";
import MUIAvatar from "./MUI/Avatar";
import { Camera } from "@mui/icons-material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../config/constant";
import axios from "axios";
const VisuallyHiddenInput = styled("input")({
  opacity: 0,
  height: "100%",
  width: "100%",
  overflow: "hidden",
  position: "absolute",
  top: 0,
  left: 0,
  whiteSpace: "nowrap",
  background: "red",
  cursor: "pointer",
});
type Props = {
  source: string;
  onChange?: (name: string) => void;
};
const ImageUpload = (props: Props) => {
  const { source, onChange = () => {} } = props;
  const token = useSelector((state: any) => state.auth.token);
  const [loading, setLoading] = useState<boolean>(false);

  const imageUpload = async (e: any) => {
    // change to upload server after
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      axios
        .post(`${SERVER_URL}/file/upload_avatar`, formData, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          onChange(res.data.path);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div
      className="relative"
      style={{
        height: "100px",
        width: "100px",
        borderRadius: "100%",
        border: "dashed 3px black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        "Uploading..."
      ) : (
        <MUIAvatar style={{ height: "100%", width: "100%" }} src={source} />
      )}
      <Camera
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          background: "white",
          borderRadius: "100%",
        }}
      />
      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        onChange={imageUpload}
      />
    </div>
  );
};

export default ImageUpload;
