import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function Home(){
  const [user, setUser] = useState({});

  //specifies where to access the server and DB
  const instance = axios.create({baseURL: 'http://localhost:8000/auth'});

  //pulls user's saved List from DB and stores it in listArr
  function fetchUser(){
    instance.get("/pullUser", { withCredentials : true })
    .then(function (response) {
      setUser(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
  };

  function logUserOut(){
    instance.get("/logout", { withCredentials : true })
    .then(function (response) {
      setUser({});
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  useEffect(fetchUser, []);

  return <div>
  <h6>BEFORE YOU USE THIS WEBSITE, KNOW THAT I (MOHANNED AL NOUMAN) HAVE ACCESS TO ALL OF YOUR LISTS SO PLEASE DON'T POST ANYTHING PRIVATE</h6>
  <h6>This website may contain a few (probably a lot) of bugs</h6>
  <h2>Hello {user.name?user.name:"anonymous"} and welcome to Mohanned's List App!</h2>

  <div className="col-sm-4">
    <div className="card social-block">
      <div className="card-body">
        {(user.name)?<button onClick={logUserOut} className="btn btn-block" type='submit'>
          Logout </button> : <a  className="btn btn-block" href='http://localhost:8000/auth/google' role='button'>
          <i className="fab fa-google"></i>
          Login with Google </a>}
      </div>
    </div>
  </div>

    <br />

    {(user.name)?<Link className={(user.name)?"":"invis"} to="/MyLists">
      <button variant="outlined">
        Click here to view your lists
      </button></Link>:<Link to={{
        pathname: '/CreateList',
        save: false
      }}>
        <button variant="outlined">
          Click here to create a new list (this will not be saved unless you login PRIOR to creating your list)
        </button></Link>}
    </div>;
}
