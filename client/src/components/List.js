import React, {useState, useEffect, useRef} from "react";
import ListItem from "./ListItem";
import axios from "axios";

//displays the list of items and subitems
export default function List(props) {
  /*****************State Variables******************/

  //tracks what's in the input text box
  const [input, setInput] = useState("");

  //stores user's items in an array
  const [listArr, setListArr] = useState([]);

  //changes webpage's title to match that of the user's list
  const [listTitle, setListTitle] = useState("");

  //tracks what's in the input text box
  const [listID, setListID] = useState(props.listId ? "/" + props.listId : "");

  //reveals the submit text box and button when the list has finished loading.
  //this is done to prevent possible loss of sync between the displayed list and list on the DB during initial loading of webpage
  const [submitClass, setSubmitClass] = useState("invis");

  /*****************Ajax requests******************/

  //specifies where to access the server and DB
  const instance = axios.create({
    baseURL: "https://mohanned-todolistv2.herokuapp.com/api"
  });

  //pulls user's saved List from DB and stores it in listArr
  function fetchList() {
    instance
      .get(listID, {withCredentials: true})
      .then(function(response) {
        setListArr([...response.data.items]);
        setListTitle(response.data.name);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  //Allows us to prevent multiple post requests from occuring simultaneously
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  //stores the user's list in the DB
  function postList() {
    let dataSent = {
      name: listTitle,
      items: listArr
    };
    instance
      .post(listID, dataSent, {
        cancelToken: source.token,
        withCredentials: true
      })
      .then(function(response) {
        setListID("/" + response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  //tracks pending Axios calls
  let pendingAxiosCalls = 0;

  //tracks increases to pendingAxiosCalls
  instance.interceptors.request.use(
    function(config) {
      pendingAxiosCalls++;
      return config;
    },
    function(error) {
      return Promise.reject(error);
    }
  );

  //tracks decreases/resolutions of pendingAxiosCalls
  instance.interceptors.response.use(
    function(response) {
      pendingAxiosCalls--;
      console.log(
        "------------  Previous request was successful. Remaining Ajax requests: " +
          pendingAxiosCalls
      );
      return response;
    },
    function(error) {
      pendingAxiosCalls--;
      console.log(
        "------------  Previous request was unsuccessful. Remaining Ajax requests: " +
          pendingAxiosCalls
      );
      return Promise.reject(error);
    }
  );

  /*****************Side effects******************/

  //Ignores first two changes for the next side effect
  const noFetchNeeded = useRef(listID ? false : true);

  //calls fetchList on page load and only on page load
  useEffect(() => {
    if (!noFetchNeeded.current) {
      fetchList();
    }
  }, []);

  //Ignores first two changes for the next side effect
  const initial2Renders = useRef(2);

  //calls postList whenever listArr is changed.
  //ignores the first 2 changes, which are: 1. on page load and 2. When listArr is populated from fetching the DB.
  useEffect(() => {
    if (props.save) {
      if (initial2Renders.current > 0) {
        initial2Renders.current--;
        if (noFetchNeeded.current) {
          initial2Renders.current--;
        }
        //changes the class name of the submit box and button to empty to display them after your list has finished loading
        if (initial2Renders.current === 0) {
          setSubmitClass();
        }
      } else {
        //ensures only 1 axios call is ever pending at any time.
        if (pendingAxiosCalls === 1) {
          console.log("cancel previous axios call");
          source.cancel();
          //sends most up to date axios call.
          postList();
        } else {
          postList();
        }
      }
    } else {
      if (submitClass) {
        setSubmitClass();
      }
    }
  }, [listArr, listTitle]);

  //Creates ref for our input text box to allow for autofocusing whenever listArr is changed
  const inputTxt = useRef(null);

  //Autofocuses our input text box whenever listArr or submitClass (controls input text box class names) is changed
  useEffect(() => {
    inputTxt.current.focus();
  }, [listArr, submitClass]);

  /*****************State variable handlers/CRUD******************/

  //handles changes of input text box
  function handleChange(e) {
    const newInput = e.target.value;
    setInput(newInput);
  }

  //submits new item from the input text box to the array and clears text box
  function handleSubmit(e) {
    const newListItem = {item: input};
    setListArr(prev => {
      return [...prev, newListItem];
    });
    setInput("");
    e.preventDefault();
  }

  //updates the targeted list item
  function handleUpdate(e, index) {
    setListArr(prev => {
      const prevClone = prev.map(a => Object.assign({}, a));

      //recursive function used to reach the exact list item
      function updateTarget(targetArray, targetIndex) {
        const currIndex = targetIndex[0];
        if (targetIndex.length === 1) {
          targetArray[currIndex].item = input;
        } else {
          targetIndex.splice(0, 1);
          updateTarget(targetArray[currIndex].items, targetIndex);
        }
      }

      //calls the recursive function
      updateTarget(prevClone, index);
      return prevClone;
    });
    e.preventDefault();
    setInput("");
  }

  //deletes selected item from array using the specified index/indices
  function handleDelete(e, index) {
    setListArr(prev => {
      const prevClone = prev.map(a => Object.assign({}, a));

      //recursive function used to reach the exact list item
      function deleteTarget(targetArray, targetIndex) {
        const currIndex = targetIndex[0];
        if (targetIndex.length === 1) {
          targetArray.splice(currIndex, 1);
        } else {
          targetIndex.splice(0, 1);
          deleteTarget(targetArray[currIndex].items, targetIndex);
        }
      }

      //calls the recursive function
      deleteTarget(prevClone, index);
      return prevClone;
    });
    e.preventDefault();
  }

  //Adds sub item to sublist or creates new sublist
  function handleSubItem(e, cumIndex) {
    setListArr(prev => {
      const prevClone = prev.map(a => Object.assign({}, a));

      //recursive function used to add the subitem to the specified list item
      function addOrCreateSubList(targetArray, targetIndex) {
        const currIndex = targetIndex[0];
        if (targetIndex.length === 1) {
          targetArray[currIndex].items = targetArray[currIndex].items
            ? [...targetArray[currIndex].items, {item: input}]
            : [{item: input}];
        } else {
          targetIndex.splice(0, 1);
          addOrCreateSubList(targetArray[currIndex].items, targetIndex);
        }
      }

      //calls the recursive function
      addOrCreateSubList(prevClone, cumIndex);
      return prevClone;
    });
    setInput("");
    e.preventDefault();
  }

  //changes list title
  function handleTitleChange() {
    setListTitle(input);
    setInput("");
  }

  //displays all list and sublist items recursively.
  //Once an item is displayed, all subitems are then displayed. This process continues
  //until all subitems of subitems are displayed. Then the next list item is displayed.
  function displayNewList(newList, parentIndex) {
    const parInd = parentIndex ? parentIndex : [];
    return (
      <ul>
        {newList.map((object, index) => {
          return (
            <div>
              <ListItem
                content={object.item}
                key={[...parInd, index]}
                cumIndex={[...parInd, index]}
                handUpda={handleUpdate}
                handDele={handleDelete}
                handSubI={handleSubItem}
              />
              {object.items &&
                object.items.length !== 0 &&
                displayNewList(object.items, [...parInd, index])}
            </div>
          );
        })}
      </ul>
    );
  }

  /*****************Return value******************/

  return (
    <div>
      <h3 className="vis">
        {listTitle ? listTitle : "New"} list
        <button
          className="invis"
          onClick={handleTitleChange}
          type="submit"
          name="titleButton"
        >
          Change title
        </button>
      </h3>
      {displayNewList(listArr)}
      <form>
        <input
          className={submitClass}
          onChange={handleChange}
          type="text"
          name="userInput"
          value={input}
          ref={inputTxt}
        />
        <button
          className={submitClass}
          onClick={handleSubmit}
          type="submit"
          name="submitButton"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
