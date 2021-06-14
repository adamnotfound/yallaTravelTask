import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { connect } from "react-redux";
import * as actions from "../store/actions/index";
const Login = ({ setLoggedIn }) => {
  const history = useHistory();
  const [showPassword, toggleShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ rememberMe: true });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    if (e.target.name === "rememberMe")
      return setLoginForm({ ...loginForm, rememberMe: e.target.checked });
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let url = `${process.env.REACT_APP_API_URL}/auth/signin`;
    axios.post(url, loginForm).then((response) => {
      let resp = response.data;
      if (resp.status === "success") {
        localStorage.setItem("token", resp.token);
        setLoggedIn(true);
        setTimeout(function () {
          history.push("/profile");
          setLoading(false);
        }, 2000);
      } else {
        setLoading(false);
        setError(resp.error);
      }
    });
  };

  return (
    <>
      <Container className="mt-5">
        <Col className="mx-auto" lg={5} xs={12}>
          <form onSubmit={submitHandler}>
            <h4 className="font-weight-bold text-dark">Sign in</h4>
            <p className="details">Enter your details below</p>
            <input
              className="form-control mt-5"
              type="email"
              placeholder="Email Address"
              name="email"
              onChange={handleChange}
            />

            <input
              className="form-control mt-4"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <span
              className="iconField"
              onClick={(e) => toggleShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </span>

            <Row className="font-weight-bold mt-4" style={{ fontSize: "13px" }}>
              <Col>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    id="rememberMe"
                    name="rememberMe"
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
              </Col>
              <Col className="text-right text-success">
                <a>Forgot password?</a>
              </Col>
            </Row>
            <Row>
              <input
                type="submit"
                className="loginBtn btn btn-success mx-auto mt-4"
                value="Login"
                disabled={loading}
              />
            </Row>
            {error && (
              <div
                className="text-center mt-3 font-weight-bold text-danger"
                style={{ fontSize: "14px" }}
              >
                <p>{error}</p>
              </div>
            )}
          </form>
        </Col>
      </Container>
      <style>
        {`.form-control{
            height:7vh;
            font-size:14px;
          }
          .details{
            font-size:14px;
            font-weight:bold;
          }
          .loginBtn{
            height:7vh;
            width:95%;
            font-weight:bold;
            font-size:13px;
            box-shadow:10px 10px 20px #e0fff4
          }
          .iconField{
            float: right;
            margin-right: 20px;
            margin-top: -30px;
            position: relative;
            z-index: 2;
          }
          `}
      </style>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    users: state.home.users,
    user: state.home.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLoggedIn: (val) => dispatch(actions.setLoggedIn(val)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
