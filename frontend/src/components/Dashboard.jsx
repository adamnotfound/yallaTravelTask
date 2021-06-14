import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import ImageUpload from "./ImageUpload";
import DeleteModal from "./DeleteModal";
import { connect } from "react-redux";
import * as actions from "../store/actions/index";
import axios from "axios";
import MaterialTable from "material-table";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Dashboard = ({ getUsers, users, setUser, user }) => {
  const [show, setShow] = useState(false);
  const [formValues, setFormValues] = useState(user);
  const [toBeDeletedId, setToBeDeletedId] = useState("");
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const [error, setError] = useState(null);
  const handleClose = () => {
    setShow(false);
    setFormValues({});
  };
  const setLogo = (fn) => setFormValues({ ...formValues, image: fn });
  function deleteUser() {
    return new Promise((resolve, reject) => {
      axios({
        method: "delete",
        headers: { Authorization: `Bearer: ${localStorage.getItem("token")}` },
        url: `${process.env.REACT_APP_API_URL}/users/delete/${toBeDeletedId}`,
      })
        .then((result) => {
          if (result.data.status === "success") {
            resolve("Deleted successfully");
            getUsers();
          } else {
            throw new Error({ message: "Failed to delete user" });
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err.message);
        });
    });
  }
  const submitHandler = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formValues._id && formData.append("_id", formValues._id);
    formData.append("firstName", formValues.firstName);
    formData.append("lastName", formValues.lastName);
    formData.append("email", formValues.email);
    formValues.password !== user.password &&
      formData.append("password", formValues.password);
    formData.append("role", formValues.role);
    formValues.image
      ? formData.append("profileImage", formValues.image)
      : formValues.profileImage &&
        formData.append("profileImage", formValues.profileImage);
    formData.append("status", formValues.status);

    let url = `${process.env.REACT_APP_API_URL}/users/${
      formValues._id ? "edit" : "add"
    }`;
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
          toast.success(
            formValues._id ? "Edited successfully" : "Added successfully"
          );
          handleClose();
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleOpen = () => {
    setError(null);
    setShow(true);
  };
  const handleChange = (e) => {
    setError(null);
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    getUsers();
    return () => {};
  }, []);
  return (
    <>
      <Container>
        <Link to="/profile">
          <Button
            style={{ float: "right", fontWeight: "bold" }}
            variant="secondary"
            size="sm"
          >
            Settings
          </Button>
        </Link>
        <DeleteModal
          itemName="user"
          modalStatus={deleteModalStatus}
          setModalStatus={setDeleteModalStatus}
          deleteFunction={deleteUser}
        />
        <Modal show={show} onHide={handleClose}>
          <form onSubmit={submitHandler}>
            <Modal.Header closeButton>
              <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ fontSize: "16px", fontColor: "black" }}>
              <Row>
                <Col lg={7}>
                  <div className="userForm ml-2">
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      placeholder="First Name"
                      onChange={handleChange}
                      defaultValue={user.firstName}
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      placeholder="Last Name"
                      onChange={handleChange}
                      defaultValue={user.lastName}
                    />
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email Address"
                      onChange={handleChange}
                      defaultValue={user.email}
                      required
                    />
                    <input
                      type="text"
                      name="role"
                      className="form-control"
                      placeholder="Role"
                      onChange={handleChange}
                      defaultValue={user.role}
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      onChange={handleChange}
                      defaultValue={user.password}
                    />
                    <select
                      className="form-control"
                      name="status"
                      defaultValue={user.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Banned">Banned</option>
                    </select>
                  </div>
                </Col>
                <Col lg={5}>
                  <div className="text-center">
                    <p className="mb-2">Profile Image </p>
                    <ImageUpload
                      setLogo={setLogo}
                      profileImage={user.profileImage}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mt-3">
                {error && (
                  <p className="text-center mx-auto font-weight-bold text-danger">
                    {error}
                  </p>
                )}
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <Row>
                  <input
                    className="btn btn-sm btn-dark"
                    style={{ marginTop: "7%", height: "1.6%" }}
                    type="submit"
                    className="mr-3"
                    value="Submit"
                  />

                  <Button
                    variant="dark"
                    size="sm"
                    style={{ marginTop: "7%", height: "1.6%" }}
                    onClick={handleClose}
                    className="mr-3"
                  >
                    Close
                  </Button>
                </Row>
              </div>
            </Modal.Footer>
          </form>
        </Modal>
        <Row>
          <h4 className="font-weight-bold mb-3">User List</h4>
        </Row>
        <Row>
          <p className="ml-3">
            <span className="text-dark">Dashboard</span>
            <span className="breadcrumbIcon">&#67871;</span>
            <span className="text-dark">User</span>
            <span className="breadcrumbIcon">&#67871;</span>List
          </p>
        </Row>
        <Row className="mt-3">
          <MaterialTable
            title=""
            data={users}
            style={{ width: "100%", boxShadow: "15px 15px 50px silver" }}
            columns={[
              {
                title: "Name",
                field: "fullName",
              },
              { title: "Email", field: "email", filtering: false },
              {
                title: "Role",
                field: "role",
                filtering: false,
              },
              {
                title: "Status",
                field: "status",
                filtering: false,
                render: (i) => (
                  <div
                    className={`mt-1 text-center font-weight-bold ${
                      i.status === "Active"
                        ? "bg-light text-success"
                        : "bg-light text-danger"
                    }`}
                    style={{
                      height: "25px",
                      width: "60px",
                      borderRadius: "5px 5px",
                      fontSize: "13px",
                    }}
                  >
                    {i.status}
                  </div>
                ),
              },
              {
                title: "Avatar",
                filtering: false,
                render: (i) => (
                  <div>
                    <ImageUpload width={50} profileImage={i.profileImage} />
                  </div>
                ),
              },
            ]}
            actions={[
              {
                icon: "add",
                tooltip: "Add User",
                isFreeAction: true,
                onClick: (event) => {
                  setUser({});
                  handleOpen();
                },
              },
              (rowData) => ({
                icon: "edit",
                tooltip: "Edit User",
                onClick: (event, rowData) => {
                  setUser(rowData);
                  setFormValues(rowData);
                  handleOpen();
                },
              }),
              (rowData) => ({
                icon: "delete",
                tooltip: "Delete User",
                onClick: (event, rowData) => {
                  setToBeDeletedId(rowData._id);
                  setDeleteModalStatus(true);
                },
              }),
            ]}
            options={{
              search: false,
              filtering: true,
              columnsButton: true,
              showEmptyDataSourceMessage: true,
              actionsColumnIndex: -1,
            }}
          />
        </Row>
      </Container>
      <style>
        {`.breadcrumbIcon{
            margin-left: 10px;
            margin-right: 10px;
          }
          .userForm > input{
            margin-bottom:10px
          }
         .required{
            color: red;
            font-weight: bold;
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
    currentUser: state.home.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUsers: () => dispatch(actions.getUsers()),
    setUser: (user) => dispatch(actions.setUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
