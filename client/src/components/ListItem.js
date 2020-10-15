import React from "react";

function ListItem(props) {
  return (
    <form action="" method="">
      <li className={"vis " + props.striThro}>
        {props.content}
        <button
          className="invis"
          onClick={e => {
            props.handSubI(e, props.cumIndex);
          }}
          type="submit"
          name="createTxtInput"
        >
          <i className="fas fa-indent"></i>
        </button>
        <button
          className="invis"
          onClick={e => {
            props.handUpda(e, props.cumIndex);
          }}
          type="submit"
          name="updateButton"
        >
          <i className="fas fa-edit"></i>
        </button>
        <button
          className="invis"
          onClick={e => {
            props.handCros(e, props.cumIndex);
          }}
          type="submit"
          name="crossOutText"
        >
          <i className="fas fa-strikethrough"></i>
        </button>
        <button
          className="invis"
          onClick={e => {
            props.handDele(e, props.cumIndex);
          }}
          type="submit"
          name="deleteButton"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </li>
    </form>
  );
}

export default ListItem;
