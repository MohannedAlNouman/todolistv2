import React from "react";

function ListItem(props) {
  return (
    <form action="" method="">
      <li className="vis">
        {props.content}
        <button
          className="invis"
          onClick={e => {
            props.handUpda(e, props.cumIndex);
          }}
          type="submit"
          name="updateButton"
        >
          Update
        </button>
        <button
          className="invis"
          onClick={e => {
            props.handDele(e, props.cumIndex);
          }}
          type="submit"
          name="deleteButton"
        >
          Delete
        </button>
        <button
          className="invis"
          onClick={e => {
            props.handSubI(e, props.cumIndex);
          }}
          type="submit"
          name="subItemButton"
        >
          Add to sublist
        </button>
      </li>
    </form>
  );
}

export default ListItem;
