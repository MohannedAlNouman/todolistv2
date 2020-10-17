import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {Navbar, Nav} from "react-bootstrap";
import axios from "axios";

export default function MyLists() {
  const [user, setUser] = useState({});

  const [userLists, setUserLists] = useState([]);

  //https://mohanned-todolistv2.herokuapp.com
  //specifies where to access the server and DB
  const instance = axios.create({
    baseURL: "http://localhost:3001"
  });

  //pulls user's saved List from DB and stores it in listArr
  function fetchUser() {
    instance
      .get("/auth/pullUser", {withCredentials: true})
      .then(function(response) {
        setUser(response.data);
        setUserLists(response.data.lists);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  useEffect(fetchUser, []);

  function deleteList(e) {
    let listID = e.target.value;

    instance
      .delete("/api/" + listID, {
        withCredentials: true
      })
      .then(function(response) {
        setUserLists(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

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

  function displayListOfLists() {
    return userLists.length > 0 ? (
      <div>
        {userLists.map((element, index) => {
          return (
            <div className="listItems" key={index}>
              <h5 className="vis">
                {element.listName ? element.listName + " list" : "Unnamed list"}
                <Link
                  className="invis"
                  to={{
                    pathname: "/CreateList",
                    listId: element.listId,
                    save: true
                  }}
                >
                  <button variant="outlined">
                    <i className="fas fa-edit"></i>
                  </button>
                </Link>
                <button
                  className="invis"
                  value={element.listId}
                  onClick={deleteList}
                  type="submit"
                  name="deleteButton"
                >
                  X
                </button>
              </h5>
            </div>
          );
        })}
        <h6 className="myList">*Hover over an item to edit/delete it.*</h6>
      </div>
    ) : (
      user.name && (
        <h5 className="myList">
          You don't have any lists yet! Get started by clicking 'Create a new
          list" above!
        </h5>
      )
    );
  }

  return (
    <div>
      {displayNavbar()}
      <h4 className="myList">
        {user.name
          ? user.name + "'s lists:"
          : "Oh no, you were logged out! Log in again to access your lists"}
      </h4>
      {displayListOfLists()}
    </div>
  );
}
