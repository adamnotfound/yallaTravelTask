import axios from "axios";
import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";


const ChangePassword = ({ currentUser }) => {
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormValues({ ...formValues, _id: currentUser._id });
    return () => {};
  }, [currentUser]);
  const handleChange = (e) => {
    setError(null);
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const submitHandler = (e) => {
    try {
      e.preventDefault();
      if (formValues.password !== formValues.passwordConfirm)
        throw "Ops, passwords don't match.";
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/users/changepassword`,
          formValues,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.data.status === "success") {
            toast.success("Updated successfully");
          } else {
            setError(res.data.error);
          }
        });
    } catch (err) {
      setError(err);
    }
  };
  return (
    <>
      <Container className="mt-5">
        <form onSubmit={submitHandler}>
          <Row>
            <input
              type="password"
              name="oldPassword"
              className="form-control col-lg-3"
              placeholder="Old Password"
              value={formValues.oldPassword}
              onChange={handleChange}
            />
          </Row>
          <Row>
            <input
              type="password"
              name="password"
              className="form-control col-lg-3"
              value={formValues.password}
              placeholder="Password"
              onChange={handleChange}
            />
          </Row>
          <Row>
            <input
              type="password"
              name="passwordConfirm"
              className="form-control col-lg-3"
              placeholder="Confirm Password"
              value={formValues.passwordConfirm}
              onChange={handleChange}
            />
          </Row>
          <Row>
            <input
              type="submit"
              className="mt-3 col-lg-3 btn btn-dark"
              value="Submit"
            />
          </Row>
          <Row className="mt-3">
            {error && <p className="font-weight-bold text-danger">{error}</p>}
          </Row>
        </form>
      </Container>
      <style>
        {`.form-control{
            margin-top:2vh
          }`}
      </style>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.home.currentUser,
  };
};

export default connect(mapStateToProps)(ChangePassword);
