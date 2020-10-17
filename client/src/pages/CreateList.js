import React from "react";
import {Link} from "react-router-dom";
import {Navbar, Nav} from "react-bootstrap";
import List from "../components/List";

export default function CreateList(props) {
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
              save: props.location.save ? true : false
            }}
          >
            Create a new list
          </Link>
          {props.location.save && (
            <Link className="nav-link" to="/MyLists">
              My Lists
            </Link>
          )}
          {props.location.save ? (
            <Link
              className="nav-link"
              to={{
                pathname: "/",
                logout: true
              }}
            >
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
      <List listId={props.location.listId} save={props.location.save} />
    </div>
  );
}
