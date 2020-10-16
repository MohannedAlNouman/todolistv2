import React, {useState, useEffect} from "react";
import {Navbar, Nav} from "react-bootstrap";
import {Link} from "react-router-dom";
import axios from "axios";

export default function Home() {
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

  useEffect(fetchUser, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
          List App <span className="version">version 1.0.0</span>
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/CreateList">Create a new list</Nav.Link>
          {user.name && <Nav.Link href="MyLists">My Lists</Nav.Link>}
          {user.name ? (
            <Nav.Link onClick={logUserOut}>Logout</Nav.Link>
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
      <div className="homePageText">
        <h2>Hello {user.name ? user.name : "anonymous"}.</h2>
      </div>
      <div className="homePageText">
        <h5>About this app:</h5>
        <h6>
          This app uses your google login to store your lists. You can access
          these lists from any device as long as you're logged in to the same
          account.
        </h6>
      </div>
      <div className="homePageText">
        <h5>Basic list controls</h5>
        <h6>
          Clicking a list item once crosses it out. Double clicking an item
          allows you to edit it. There are also buttons to delete an item and to
          add subitems.
        </h6>
      </div>
      <div className="homePageText">
        <h5>What are you waiting for! Get started by logging in above.</h5>
      </div>
    </div>
  );
}
