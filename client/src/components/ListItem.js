import React from "react";

function ListItem(props) {
  return (
    <form action="" method="">
      <li className="vis">
        <div //moves text box to current item to update
          className={"listItemText " + props.striThro}
          onClick={e => {
            props.handCros(e, props.cumIndex);
          }}
          onDoubleClick={e => {
            props.showInpu(e, props.cumIndex, 0);
          }}
        >
          {props.content}
        </div>
        <button //moves text box below current item for subitems
          className="invis"
          onClick={e => {
            props.showInpu(e, props.cumIndex, 1);
          }}
          type="submit"
          name="createTxtInput"
        >
          <i className="fas fa-indent"></i>
        </button>
        <button //deletes current item
          className="invis"
          onClick={e => {
            props.handDele(e, props.cumIndex);
          }}
          type="submit"
          name="deleteButton"
        >
          <i className="fas fa-times-circle"></i>
        </button>
      </li>
    </form>
  );
}

export default ListItem;
