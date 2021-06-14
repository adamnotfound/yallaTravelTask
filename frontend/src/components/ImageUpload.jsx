import React, { useState, useEffect } from "react";

const ImageUpload = (props) => {
  const [image, setImage] = useState({});
  useEffect(() => {
    console.log(props.profileImage);
    setImage({
      preview: props.profileImage
        ? props.profileImage
        : "http://ssl.gstatic.com/accounts/ui/avatar_2x.png",
      raw: "",
    });
    return () => {};
  }, [props.profileImage]);
  const handleChange = (e) => {
    setImage({
      preview: URL.createObjectURL(e.target.files[0]),
      raw: e.target.files[0],
    });
    console.log(e.target.files[0]);
    console.log(URL.createObjectURL(e.target.files[0]));
    props.setLogo(e.target.files[0]);
  };

  return (
    <div className="frame-round">
      <label htmlFor="upload-button" className="crop">
        <img
          className="rounded-circle"
          width={`${props.width ? props.width : "150px"}`}
          height="auto"
          alt="Crop preview"
          src={image.preview}
        />
      </label>
      <input
        type="file"
        accept="image/*"
        id="upload-button"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
};

export default ImageUpload;
