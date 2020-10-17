import React, {useState, useEffect} from "react";
import {Navbar, Nav} from "react-bootstrap";
import {Link} from "react-router-dom";
import axios from "axios";

export default function Home(props) {
  const [user, setUser] = useState({});

  //https://mohanned-todolistv2.herokuapp.com/auth
  //specifies where to access the server and DB
  const instance = axios.create({
    baseURL: "http://localhost:3001/auth"
  });

  //pulls user's saved List from DB and stores it in listArr
  function fetchUser() {
    instance
      .get("/pullUser", {withCredentials: true})
      .then(function(response) {
        setUser(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function logUserOut() {
    instance
      .get("/logout", {withCredentials: true})
      .then(function(response) {
        setUser({});
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  useEffect(() => {
    if (props.location.logout) {
      logUserOut();
    } else {
      fetchUser();
    }
  }, []);

  function displayNavbar() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
          List App <span className="version">version 1.0.0</span>
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link
            className="nav-link"
            to={{
              pathname: "/CreateList",
              save: user.name ? true : false
            }}
          >
            Create a new list
          </Link>
          {user.name && (
            <Link className="nav-link" to="/MyLists">
              My Lists
            </Link>
          )}
          {user.name ? (
            <Link className="nav-link" onClick={logUserOut}>
              Logout
            </Link>
          ) : (
            <a
              className="nav-link"
              ///auth/google
              href="http://localhost:3001/auth/google"
              role="button"
            >
              <i className="fab fa-google"></i>
              {" Login with Google"}
            </a>
          )}
        </Nav>
      </Navbar>
    );
  }

  return (
    <div>
      {displayNavbar()}
      <div className="homePageText">
        <h2>Hello {user.name ? user.name : "anonymous"}.</h2>
      </div>
      <div className="homePageText">
        <h4>About this app:</h4>
        <h5>
          This app uses your google login to store your lists. You can access
          these lists from any device as long as you're logged in to the same
          account.
        </h5>
      </div>
      <div className="homePageText">
        <h4>Basic list controls</h4>
        <h5>
          Clicking a list item once crosses it out. Double clicking an item
          allows you to edit it. Buttons to delete and to create sublists appear
          when you hover over a list item.
        </h5>
      </div>
      <div className="homePageText">
        <h4>What are you waiting for! Get started by logging in above.</h4>
      </div>
    </div>
  );
}
