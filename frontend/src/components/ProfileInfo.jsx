import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import * as actions from "../store/actions/index";
import ImageUpload from "./ImageUpload";
import axios from "axios";
import { toast } from "react-toastify";
const ProfileInfo = ({ currentUser, getUsers }) => {
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (currentUser._id) setFormValues(currentUser);
    return () => {};
  }, [currentUser]);

  const setLogo = (fn) => setFormValues({ ...formValues, image: fn });
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const submitHandler = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("_id", formValues._id);
    formData.append("firstName", formValues.firstName);
    formData.append("lastName", formValues.lastName);
    formData.append("email", formValues.email);
    formValues.image
      ? formData.append("profileImage", formValues.image)
      : formValues.profileImage &&
        formData.append("profileImage", formValues.profileImage);
    let url = `${process.env.REACT_APP_API_URL}/users/edit`;
    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          getUsers();
          toast.success("Updated successfully");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Container>
        <form onSubmit={submitHandler}>
          <Row className="mt-3">
            <Col lg={4}>
              <div className="profileImageContainer mx-auto text-center pt-5">
                <ImageUpload
                  className="rounded-circle"
                  setLogo={setLogo}
                  profileImage={formValues.profileImage}
                />
                <p
                  className="pt-3"
                  style={{ fontWeight: "bold", fontSize: "12px" }}
                >
                  Allowed *.jpeg,*.jpg,*.png
                </p>
              </div>
            </Col>
            <Col lg={8}>
              <div className="profileInfoContainer container">
                <div style={{ height: "80%" }}>
                  <Row className="pt-5">
                    <Col lg={6}>
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        onChange={handleChange}
                        defaultValue={formValues.firstName}
                        required
                      />
                    </Col>
                    <Col lg={6}>
                      <label htmlFor="lastName">Last Name</label>

                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        onChange={handleChange}
                        defaultValue={formValues.lastName}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={6}>
                      <label htmlFor="email">Email</label>

                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        onChange={handleChange}
                        defaultValue={formValues.email}
                        required
                      />
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row className="mx-auto text-center">
                    <input
                      className="btn btn-dark btn-block mx-auto mt-4"
                      style={{ marginTop: "10%", height: "7vh" }}
                      type="submit"
                      value="Submit"
                    />
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </form>
      </Container>
      <style>
        {`.profileImageContainer,.profileInfoContainer{
            width:100%;
            height:${window.screen.width > 1000 ? "70vh" : "35vh"};
            background-color:white;
            box-shadow: 10px 10px 50px silver;
            border-radius: 10px 10px;
          }
          .profileInfoContainer{
            height:70vh
          }
          .form-control{
            height:6vh;
          }
         
          `}
      </style>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.home.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUsers: () => dispatch(actions.getUsers()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);
