import React, { useEffect } from "react";
import { Tabs, Tab, Row, Container, Button } from "react-bootstrap";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actions from "../store/actions/index";

const Profile = ({ getUsers, currentComponent, changeComponent }) => {
  useEffect(() => {
    getUsers();
    return () => {};
  }, []);
  return (
    <>
      <Container>
        <Link to="/dashboard">
          <Button
            style={{ float: "right", fontWeight: "bold" }}
            variant="secondary"
            size="sm"
          >
            Dashboard
          </Button>
        </Link>
        <Row>
          <h4 className="font-weight-bold mb-3">Account</h4>
        </Row>
        <Row>
          <p className="ml-3">
            <span className="text-dark">Dashboard</span>
            <span className="breadcrumbIcon">&#67871;</span>
            <span className="text-dark">User</span>
            <span className="breadcrumbIcon">&#67871;</span>Account Settings
          </p>
        </Row>
        <Tabs activeKey={currentComponent} onSelect={(k) => changeComponent(k)}>
          <Tab eventKey="profileInfo" title="General Information">
            <ProfileInfo defaultControl="overview" />
          </Tab>
          <Tab eventKey="changePassword" title="Change Password">
            <ChangePassword />
          </Tab>
        </Tabs>
      </Container>
      <style>{`.breadcrumbIcon{
            margin-left: 10px;
            margin-right: 10px;
      }
      .nav-item{
        font-weight:bold;
        font-size:13px;
      }
          `}</style>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    currentComponent: state.home.currentComponent,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeComponent: (k) => dispatch(actions.changeComponent(k)),
    getUsers: () => dispatch(actions.getUsers()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
