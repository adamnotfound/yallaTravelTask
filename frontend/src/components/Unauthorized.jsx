import React from "react";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
const Unauthorized = () => {
  return (
    <>
      <Alert variant="danger">
        <Alert.Heading>Oh snap! You are not authorized</Alert.Heading>
        <p>
          You are not authorized to preview this page! Please contact with your
          admin to give you the right privilege
        </p>
      </Alert>

      <p className="text-center">
        <Link to="/login">Back to Home</Link>
      </p>
    </>
  );
};

export default Unauthorized;
