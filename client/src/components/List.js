import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import ListItem from "./ListItem";

//displays the list of items and subitems
export default function List(props) {
  /*****************State Variables******************/

  //tracks what's in the input text box
  const [input, setInput] = useState("");

  //tracks what's in the update/subitem text box
  const [movingInput, setMovingInput] = useState("");

  //tracks the lists title
  const [listTitle, setListTitle] = useState({title: ""});

  //stores user's items in an array
  const [listArr, setListArr] = useState([]);

  //stores how many undo's are stored in listHistory
  const [undosRemaining, setUndosRemaining] = useState(0);

  //stores how many undo's are stored in listHistory
  const [redosRemaining, setRedosRemaining] = useState(0);

  //reveals the submit text box and button when the list has finished loading.
  //this is done to prevent possible loss of sync between the client list and the DB list during initial loading of webpage
  const [submitClass, setSubmitClass] = useState("invis");

  /*****************Ajax requests******************/

  //contains the list ID if available to save/update the list
  const listID = useRef(props.listId ? props.listId : "");

  //https://mohanned-todolistv2.herokuapp.com/api/
  //specifies where to access the server to route to the DB
  const instance = axios.create({
    baseURL: "http://localhost:3001/api/"
  });

  //pulls user's saved List from DB and stores it in listArr
  function fetchList() {
    instance
      .get(listID.current, {
        withCredentials: true
      })
      .then(function(response) {
        actualChange.current = true;
        setListArr([...response.data.items]);
        setListTitle({
          title: response.data.name
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  //Allows us to prevent multiple post requests from occuring simultaneously
  const cancelTokenSource = axios.CancelToken.source();

  //stores the user's list in the DB
  function postList() {
    let dataSent = {
      name: listTitle.title,
      items: listArr
    };

    instance
      .post(listID.current, dataSent, {
        cancelToken: cancelTokenSource.token,
        withCredentials: true
      })
      .then(function(response) {
        //if a new list was saved, it pulls that lists ID
        if (!listID.current) {
          listID.current = response.data;
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  //tracks pending Axios calls
  const pendingAxiosCalls = useRef(0);

  //tracks increases to pendingAxiosCalls
  instance.interceptors.request.use(
    function(config) {
      pendingAxiosCalls.current++;
      return config;
    },
    function(error) {
      return Promise.reject(error);
    }
  );

  //tracks decreases/resolutions of pendingAxiosCalls
  instance.interceptors.response.use(
    function(response) {
      pendingAxiosCalls.current--;
      return response;
    },
    function(error) {
      pendingAxiosCalls.current--;
      return Promise.reject(error);
    }
  );

  /*****************Side effects******************/

  //calls fetchList on page load and only on page load if a listID is present
  useEffect(() => {
    if (listID.current) {
      fetchList();
      fetchEqualizer.current = true;
    }
  }, []);

  //Ignores first two changes for the next side effect
  const skipFirst2Renders = useRef(2);

  //calls postList whenever listArr or listTitle is changed.
  //ignores the first 2 changes, which are: 1. on page load and 2. When listArr is populated from fetching the DB.
  //If props.save is set to false, the post request is skipped
  useEffect(() => {
    if (props.save) {
      if (skipFirst2Renders.current > 0) {
        skipFirst2Renders.current--;
        if (!listID.current) {
          skipFirst2Renders.current = 0;
        }
        //changes the class name of the submit box and button to empty to display them after your list has finished loading
        if (skipFirst2Renders.current === 0) {
          setSubmitClass();
        }
      } else {
        //ensures only 1 axios call is ever pending at any time.
        if (pendingAxiosCalls.current >= 1) {
          cancelTokenSource.cancel("post cancelled");
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

  //tracks the history of changes to the list
  const listHistory = useRef([]);

  //tracks the history of changes to the list
  const futureListHistory = useRef([]);

  //Specifies how many changes to store
  const limit = useRef(10);

  //equalizes the number of undos for fetched lists and newly created lists
  const fetchEqualizer = useRef(false);

  //tracks changes to items and subitems
  //ignores changes to other key values
  const actualChange = useRef(true);

  //if a change to the list is made, any stored future lists are deleted
  const deleteRedoHistory = useRef(true);

  //Takes a snapshot of the list whenever a change is made and stores that value
  useEffect(() => {
    if (actualChange.current) {
      actualChange.current = false;

      if (redosRemaining > 0 && deleteRedoHistory.current) {
        futureListHistory.current.splice(0, futureListHistory.current.length);
        setRedosRemaining(futureListHistory.current.length);
      }

      deleteRedoHistory.current = true;

      //creates a deep clone of listArr
      const listArrClone = JSON.parse(JSON.stringify(listArr));

      //adds the cloned list to list history
      listHistory.current.push(listArrClone);

      //equalizes the number of undos for fetched lists and newly created lists
      if (fetchEqualizer.current && listHistory.current.length > 1) {
        listHistory.current.splice(0, 1);
        fetchEqualizer.current = false;
      }

      //caps off list history to the past <limit> changes
      if (listHistory.current.length >= limit.current + 2) {
        listHistory.current.shift();
      }
      setUndosRemaining(listHistory.current.length - 1);
    }
  }, [listArr]);

  //Creates ref for our input text box to allow for autofocusing
  const inputTxt = useRef(null);

  //Only autofocuses after a root list item is added
  const autoFocus = useRef(true);

  //Autofocuses our input text box whenever a root list item is added to our list
  useEffect(() => {
    if (!submitClass) {
      if (autoFocus.current) {
        inputTxt.current.focus();
        autoFocus.current = false;
      }
    }
  }, [listArr, submitClass]);

  //Creates ref for our moving input to allow for autofocusing
  const movingInputTxt = useRef(null);

  //Autofocuses our moving input whenever a subitem is created
  useEffect(() => {
    movingInputTxt.current && movingInputTxt.current.focus();
  }, [listArr]);

  const titleTxt = useRef(null);

  //Autofocuses our moving input whenever a subitem is created
  useEffect(() => {
    titleTxt.current && titleTxt.current.focus();
  }, [listTitle]);

  /*****************State variable handlers/CRUD******************/

  //closes the title text box and the moving input if they are open
  function closeTitleAndMovingInput(variation) {
    if (variation === 1 || variation === 3) {
      //closes out of title edit box
      if (listTitle.edit) {
        setListTitle(prevTitle => {
          const prevTitleClone = Object.assign({}, prevTitle);
          prevTitleClone.edit = false;
          return prevTitleClone;
        });
      }
    }

    if (variation === 2 || variation === 3) {
      //checks if a moving input is open, if so, it clears the text box and closes it
      if (movingInputLimiter.current) {
        setListArr(prev => {
          const prevClone = prev.map(a => Object.assign({}, a));
          setMovingInput("");
          collapsePrevMovingInput(prevClone);
          movingInputLimiter.current = false;
          movingInputFound.current = false;
          return prevClone;
        });
      }
    }
  }

  //handles changes of input text box
  function handleChange(e) {
    const newInput = e.target.value;
    setInput(newInput);
  }

  //submits new item from the input text box to the list array and clears the text box
  function handleSubmit(e) {
    //autofocuses the input text box
    autoFocus.current = true;

    //saves change to the list history array
    actualChange.current = true;

    closeTitleAndMovingInput(3);

    setListArr(prev => {
      //creates a shallow clone of the array
      const prevClone = prev.map(a => Object.assign({}, a));

      // creates the new item to be added
      const newListItem = {
        item: input
      };

      //adds the item to the array
      return [...prevClone, newListItem];
    });
    setInput("");
    e.preventDefault();
  }

  //handles changes of the moving input text box
  function handleMovingInputChange(e) {
    const newInput = e.target.value;
    setMovingInput(newInput);
  }

  //updates the targeted item
  function handleUpdate(e, index) {
    //saves change to the list history array
    actualChange.current = true;

    closeTitleAndMovingInput(1);

    setListArr(prev => {
      const prevClone = prev.map(a => Object.assign({}, a));

      //recursive function used to reach the exact list item
      function updateTarget(targetArray, targetIndex) {
        const currIndex = targetIndex[0];
        if (targetIndex.length === 1) {
          targetArray[currIndex].item = movingInput;
        } else {
          targetIndex.splice(0, 1);
          updateTarget(targetArray[currIndex].items, targetIndex);
        }
      }

      //calls the recursive function
      updateTarget(prevClone, index);

      closeTitleAndMovingInput(2);

      return prevClone;
    });
    e.preventDefault();
  }

  //Adds a sub item to the sublist or creates new sublist
  function handleSubItemSubmit(e, cumIndex) {
    //saves change to the list history array
    actualChange.current = true;

    closeTitleAndMovingInput(1);

    setListArr(prev => {
      const prevClone = prev.map(a => Object.assign({}, a));

      //recursive function used to add the subitem to the specified list item
      function addOrCreateSubList(targetArray, targetIndex) {
        const currIndex = targetIndex[0];
        if (targetIndex.length === 1) {
          targetArray[currIndex].items = targetArray[currIndex].items
            ? [
                ...targetArray[currIndex].items,
                {
                  item: movingInput
                }
              ]
            : [
                {
                  item: movingInput
                }
              ];
        } else {
          targetIndex.splice(0, 1);
          addOrCreateSubList(targetArray[currIndex].items, targetIndex);
        }
      }

      //calls the recursive function
      addOrCreateSubList(prevClone, cumIndex);
      return prevClone;
    });
    setMovingInput("");
    e.preventDefault();
  }

  //deletes selected item from array using the specified index/indices
  function handleDelete(e, index) {
    //saves change to the list history array
    actualChange.current = true;

    closeTitleAndMovingInput(3);

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

  //crosses out the selected list item
  function handleCrossOut(e, cumIndex) {
    //saves change to the list history array
    actualChange.current = true;

    closeTitleAndMovingInput(3);

    setListArr(prev => {
      const prevClone = prev.map(a => Object.assign({}, a));

      //recursive function used to reach the exact list item
      function strikeThrough(targetArray, targetIndex) {
        const currIndex = targetIndex[0];
        if (targetIndex.length === 1) {
          targetArray[currIndex].strikeThrough = !targetArray[currIndex]
            .strikeThrough;
        } else {
          targetIndex.splice(0, 1);
          strikeThrough(targetArray[currIndex].items, targetIndex);
        }
      }

      //calls the recursive function
      strikeThrough(prevClone, cumIndex);
      return prevClone;
    });
    e.preventDefault();
  }

  //tracks if there is a moving input open currently
  const movingInputLimiter = useRef(false);

  //breaks out of the collapse moving input function below
  const movingInputFound = useRef(false);

  //closes the previous moving input
  function collapsePrevMovingInput(targetArray) {
    for (let i = 0; i < targetArray.length; i++) {
      if (movingInputFound.current) {
        break;
      } else {
        if (targetArray[i].txtInput) {
          targetArray[i].txtInput = false;
          movingInputFound.current = true;
          break;
        } else if (targetArray[i].editItem) {
          targetArray[i].editItem = false;
          movingInputFound.current = true;
          break;
        }
        //recursively calls self to check through all items and subitems
        targetArray[i].items &&
          targetArray[i].items.length !== 0 &&
          collapsePrevMovingInput(targetArray[i].items);
      }
    }
  }

  //opens the moving input to the relevant position.
  //for updates, the input replaces the item.
  //for sublists, the input is placed below the root item
  function showMovingInput(e, cumIndex, variation) {
    setListArr(prev => {
      const prevClone = prev.map(a => Object.assign({}, a));

      //recursive function used to reach the exact list item
      function locateTarget(targetArray, targetIndex) {
        const currIndex = targetIndex[0];

        closeTitleAndMovingInput(1);

        if (targetIndex.length === 1) {
          if (variation === 0) {
            //Replaces item with moving input to update the item
            setMovingInput(targetArray[currIndex].item); //populates moving input with previous item value
            if (targetArray[currIndex].editItem) {
              //closing the only movable input thats open
              targetArray[currIndex].editItem = false;
              movingInputLimiter.current = false;
            } else if (!movingInputLimiter.current) {
              //opening an input when none are currently open
              targetArray[currIndex].editItem = true;
              movingInputLimiter.current = true;
            } else {
              //closing the only other input open and opening one up at the target location
              collapsePrevMovingInput(prevClone);
              movingInputFound.current = false;
              targetArray[currIndex].editItem = true;
            }
          } else if (variation === 1) {
            //places moving input below root item to allow for subitems
            setMovingInput(""); //clears moving input before its made visible
            if (targetArray[currIndex].txtInput) {
              //closing the only movable input thats open
              targetArray[currIndex].txtInput = false;
              movingInputLimiter.current = false;
            } else if (!movingInputLimiter.current) {
              //opening an input when none are currently open
              targetArray[currIndex].txtInput = true;
              movingInputLimiter.current = true;
            } else {
              //closing the only other input open and opening one up at the target location
              collapsePrevMovingInput(prevClone);
              movingInputFound.current = false;
              targetArray[currIndex].txtInput = true;
            }
          }
        } else {
          targetIndex.splice(0, 1);
          locateTarget(targetArray[currIndex].items, targetIndex);
        }
      }

      //calls the recursive function
      locateTarget(prevClone, cumIndex);
      return prevClone;
    });
    e.preventDefault();
  }

  function showTitleInput() {
    setListTitle(prevTitle => {
      const prevTitleClone = Object.assign({}, prevTitle);
      prevTitleClone.edit = true;
      return prevTitleClone;
    });

    closeTitleAndMovingInput(2);
  }

  //changes the list title
  function handleTitleChange(e) {
    const newTitle = e.target.value;
    setListTitle(prevTitle => {
      const prevTitleClone = Object.assign({}, prevTitle);
      prevTitleClone.title = newTitle;
      return prevTitleClone;
    });
  }

  function undo() {
    if (undosRemaining > 0) {
      actualChange.current = true;
      deleteRedoHistory.current = false;

      setListArr(() => {
        futureListHistory.current.push(listHistory.current.pop());
        setRedosRemaining(futureListHistory.current.length);

        const prevList = listHistory.current.pop();
        collapsePrevMovingInput(prevList);
        movingInputLimiter.current = false;
        movingInputFound.current = false;
        return prevList;
      });
    }
  }

  function redo() {
    if (redosRemaining > 0) {
      actualChange.current = true;
      deleteRedoHistory.current = false;

      setListArr(() => {
        const prevList = futureListHistory.current.pop();
        setRedosRemaining(futureListHistory.current.length);

        //removes any open moving inputs
        collapsePrevMovingInput(prevList);
        movingInputLimiter.current = false;
        movingInputFound.current = false;
        return prevList;
      });
    }
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
              {//if the update function is called, the moving input replaces the list item
              object.editItem ? (
                <li>
                  <form>
                    <input
                      className={submitClass + " textInput"}
                      onChange={handleMovingInputChange}
                      type="text"
                      name="movingInput"
                      value={movingInput}
                      ref={movingInputTxt}
                    />
                    <button
                      className={submitClass + " myButton"}
                      onClick={e => {
                        handleUpdate(e, [...parInd, index]);
                      }}
                      type="submit"
                      name="editButton"
                    >
                      <i className="fas fa-plus-circle"></i>
                    </button>
                  </form>
                </li>
              ) : (
                //otherwise the list item is shown
                <ListItem
                  striThro={object.strikeThrough && "strikeThrough"}
                  content={object.item}
                  key={[...parInd, index]}
                  cumIndex={[...parInd, index]}
                  showInpu={showMovingInput}
                  handDele={handleDelete}
                  handCros={handleCrossOut}
                />
              )}
              {//displays all subitems below the root list item
              object.items &&
                object.items.length !== 0 &&
                displayNewList(object.items, [...parInd, index])}
              {//if the sub item function is called, a moving input is placed below the last subitem
              object.txtInput && (
                <form>
                  <input
                    className={submitClass + " textInput"}
                    onChange={handleMovingInputChange}
                    type="text"
                    name="movingInput"
                    value={movingInput}
                    ref={movingInputTxt}
                  />
                  <button
                    className={submitClass + " myButton"}
                    onClick={e => {
                      handleSubItemSubmit(e, [...parInd, index]);
                    }}
                    type="submit"
                    name="subItemButton"
                  >
                    <i className="fas fa-plus-circle"></i>
                  </button>
                  <button
                    className={submitClass + " myButton"}
                    onClick={() => {
                      closeTitleAndMovingInput(2);
                    }}
                    type="submit"
                    name="closeMovingInput"
                  >
                    <i className="fas fa-times-circle"></i>
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </ul>
    );
  }

  function displayTitle() {
    return listTitle.edit ? (
      <form>
        <input
          className="textInput listTitle"
          onChange={handleTitleChange}
          type="text"
          name="title"
          value={listTitle.title}
          ref={titleTxt}
        />
        {" list "}
        <button
          className="myButton"
          onClick={() => {
            closeTitleAndMovingInput(1);
          }}
          type="submit"
          name="changeTitle"
        >
          <i className="fas fa-plus-circle"></i>
        </button>
      </form>
    ) : (
      <h3 className="vis listTitle">
        {listTitle.title
          ? listTitle.title + " list "
          : "Unnamed list (hover over to change)"}
        <button
          className="invis myButton"
          onClick={showTitleInput}
          type="submit"
          name="changeTitle"
        >
          <i className="fas fa-edit"></i>
        </button>
      </h3>
    );
  }

  /*****************Return value******************/

  return (
    <div className="list">
      <div className="listBox">
        {displayTitle()}
        <button
          className={submitClass + " undoBtn myButton"}
          onClick={undo}
          type="submit"
          name="undoButton"
        >
          <i className="fas fa-undo"></i>
        </button>
        {" x " + undosRemaining + "  "}
        <button
          className={submitClass + " redoBtn myButton"}
          onClick={redo}
          type="submit"
          name="redoButton"
        >
          <i className="fas fa-redo"></i>
        </button>
        {" x " + redosRemaining}
        {displayNewList(listArr)}
      </div>
      <form>
        <input
          className={submitClass + " textInput"}
          onChange={handleChange}
          type="text"
          name="userInput"
          value={input}
          ref={inputTxt}
        />
        <button
          className={submitClass + " myButton"}
          onClick={handleSubmit}
          type="submit"
          name="submitButton"
        >
          <i className="fas fa-plus-circle"></i>
        </button>
      </form>
    </div>
  );
}
