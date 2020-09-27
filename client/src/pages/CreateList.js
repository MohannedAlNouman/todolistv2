import React from 'react';
import { Link } from "react-router-dom";
import List from '../components/List';

export default function CreateList(props){
  return <div><List listId={props.location.listId} save={props.location.save} />
  <br/><Link to="/">
    <button variant="outlined">
      Click here to return to the homepage
    </button>
  </Link>
  {(props.location.save)&&<Link to="/MyLists">
    <button variant="outlined">
      Click here to return to your lists
    </button>
  </Link>}
  </div>;
}
