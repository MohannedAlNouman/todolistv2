import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function MyLists(){
  const [user, setUser] = useState({lists: []});

  const [userLists, setUserLists] = useState([{}]);

  //specifies where to access the server and DB
  const instance = axios.create({baseURL: 'http://localhost:8000'});

  //pulls user's saved List from DB and stores it in listArr
  function fetchUser(){
    instance.get("/auth/pullUser", { withCredentials : true })
    .then(function (response) {
      setUser(response.data);
      setUserLists(response.data.lists);
    })
    .catch(function (error) {
      console.log(error);
    })
  };

  useEffect(fetchUser, []);


  function deleteList(e){
    let listID = e.target.value;

      instance.delete("/api/"+listID, {
        withCredentials: true
      })
      .then(function (response) {
        setUserLists(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return <div>
  <h1>Hello {user.name?user.name:"anonymous"}, here are your lists:</h1>

  {(userLists.length>0)?userLists.map((element, index)=>{
    return <div><p className="vis" >{element.listName?element.listName + " list":"unnamed list"} <Link className="invis" to={{
      pathname: '/CreateList',
      listId: element.listId,
      save: true
    }}><button variant="outlined">
          Click here to access this list.
        </button></Link>
        <button className="invis" value={element.listId} onClick={deleteList} type="submit" name="deleteButton">Delete</button>
        </p></div>;
  }):<p>You don't have any lists yet! Get started!</p>}

  <Link to={{
    pathname: '/CreateList',
    save: true
  }}>
    <button variant="outlined">
      Click here to create a new list.
    </button></Link>

  <br/>
  <br/>

  <Link to="/">
    <button variant="outlined">
      Click here to return to the homepage.
    </button></Link></div>;
}
