import React, { Suspense, useEffect } from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, useHistory, Redirect } from "react-router-dom";
import Switch from "react-bootstrap/esm/Switch";
import { toast } from "react-toastify";
import Unauthorized from "./components/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import { connect } from "react-redux";
import * as actions from "./store/actions";
const Login = React.lazy(() => import("./components/Login"));
const Dashboard = React.lazy(() => import("./components/Dashboard"));
const Profile = React.lazy(() => import("./components/Profile"));

function App({ loggedIn, setLoggedIn }) {
  const history = useHistory();
  useEffect(() => {
    toast.configure({
      style: { fontWeight: "bold" },
      className: "text-center",
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token") && !loggedIn) setLoggedIn(true);
    return () => {};
  }, [loggedIn]);
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700"
        rel="stylesheet"
        type="text/css"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Muli:400,400i,800,800i"
        rel="stylesheet"
        type="text/css"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Play:wght@700&display=swap"
        rel="stylesheet"
      ></link>
      <div className="wrapper" style={{ zIndex: "-10" }}>
        <div className="content" style={{ marginLeft: "-30px" }}>
          <Suspense
            fallback={
              <div>
                <p>Error</p>
              </div>
            }
          >
            <Switch>
              <Route
                path="/"
                exact
                render={() => {
                  return localStorage.getItem("token") ? (
                    <Redirect to="/profile" />
                  ) : (
                    <Redirect to="/login" />
                  );
                }}
              />

              <Route path="/login" exact component={Login} />
              <ProtectedRoute
                exact
                path="/dashboard"
                user={loggedIn || localStorage.getItem("token")}
                component={Dashboard}
              />
              <ProtectedRoute
                exact
                path="/profile"
                user={loggedIn || localStorage.getItem("token")}
                component={Profile}
              />
              <Route path="/unauthorized" exact component={Unauthorized} />
            </Switch>
          </Suspense>
        </div>
      </div>
      <style>{`
      *{
        font-family:Ubuntu
      }
      `}</style>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.home.loggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setLoggedIn: (val) => dispatch(actions.setLoggedIn(val)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
