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

  //stores user's items in an array
  const [listArr, setListArr] = useState([]);

  //tracks the lists title
  const [listTitle, setListTitle] = useState("");

  //contains the list ID if available to save/update the list
  const [listID, setListID] = useState(props.listId ? props.listId : "");

  //reveals the submit text box and button when the list has finished loading.
  //this is done to prevent possible loss of sync between the client list and the DB list during initial loading of webpage
  const [submitClass, setSubmitClass] = useState("invis");

  /*****************Ajax requests******************/

  //https://mohanned-todolistv2.herokuapp.com/api/
  //specifies where to access the server to route to the DB
  const instance = axios.create({
    baseURL: "http://localhost:3001/api/"
  });

  //pulls user's saved List from DB and stores it in listArr
  function fetchList() {
    instance
      .get(listID, {
        withCredentials: true
      })
      .then(function(response) {
        setListArr([...response.data.items]);
        setListTitle(response.data.name);
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
      name: listTitle,
      items: listArr
    };

    instance
      .post(listID, dataSent, {
        cancelToken: cancelTokenSource.token,
        withCredentials: true
      })
      .then(function(response) {
        //if a new list was saved, it pulls that lists ID
        if (!listID) {
          setListID(response.data);
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

  //If a new list is created, no get request is needed
  const noFetchNeeded = useRef(listID ? false : true);

  //calls fetchList on page load and only on page load
  useEffect(() => {
    if (!noFetchNeeded.current) {
      fetchList();
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
        if (noFetchNeeded.current) {
          skipFirst2Renders.current--;
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

  //Creates ref for our input text box to allow for autofocusing
  const inputTxt = useRef(null);

  //Only autofocuses after a root list item is added
  const autoFocus = useRef(true);

  //Autofocuses our input text box whenever a root list item is added to listArr
  useEffect(() => {
    if (autoFocus.current) {
      inputTxt.current.focus();
    } else {
      autoFocus.current = true;
    }
  }, [listArr, submitClass]);

  //Creates ref for our moving input to allow for autofocusing
  const subItemTxt = useRef(null);

  // Autofocuses our moving input whenever a subitem is created
  useEffect(() => {
    subItemTxt.current && subItemTxt.current.focus();
  }, [listArr]);

  /*****************State variable handlers/CRUD******************/

  //changes the list title
  function handleTitleChange() {
    setListTitle(input);
    setInput("");
  }

  //handles changes of input text box
  function handleChange(e) {
    const newInput = e.target.value;
    setInput(newInput);
  }

  //submits new item from the input text box to the list array and clears the text box
  function handleSubmit(e) {
    setListArr(prev => {
      //clones the array
      const prevClone = prev.map(a => Object.assign({}, a));

      //checks if a moving input is open, if so, it clears the text box and closes it
      if (movingInputLimiter.current) {
        setMovingInput("");
        collapsePrevMovingInput(prevClone);
        movingInputLimiter.current = false;
        movingInputFound.current = false;
      }

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

      //closes the moving input
      collapsePrevMovingInput(prevClone);
      movingInputLimiter.current = false;
      movingInputFound.current = false;

      //prevents autofocusing on the input text box
      autoFocus.current = false;

      return prevClone;
    });
    setMovingInput("");
    e.preventDefault();
  }

  //Adds a sub item to the sublist or creates new sublist
  function handleSubItemSubmit(e, cumIndex) {
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
    setListArr(prev => {
      const prevClone = prev.map(a => Object.assign({}, a));

      //closes out of any open moving inputs
      if (movingInputLimiter.current) {
        setMovingInput("");
        collapsePrevMovingInput(prevClone);
        movingInputLimiter.current = false;
        movingInputFound.current = false;
      }

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

      //prevents autofocusing on the input text box
      autoFocus.current = false;

      //calls the recursive function
      deleteTarget(prevClone, index);
      return prevClone;
    });
    e.preventDefault();
  }

  //crosses out the selected list item
  function handleCrossOut(e, cumIndex) {
    setListArr(prev => {
      const prevClone = prev.map(a => Object.assign({}, a));

      //checks if a moving input is open, if so, it clears the text box and closes it
      if (movingInputLimiter.current) {
        setMovingInput("");
        collapsePrevMovingInput(prevClone);
        movingInputLimiter.current = false;
        movingInputFound.current = false;
      }

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

      //prevents autofocusing on the input text box
      autoFocus.current = false;

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
  function showmovingInput(e, cumIndex, variation) {
    setListArr(prev => {
      const prevClone = prev.map(a => Object.assign({}, a));

      //recursive function used to reach the exact list item
      function locateTarget(targetArray, targetIndex) {
        const currIndex = targetIndex[0];

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
                      className={submitClass}
                      onChange={handleMovingInputChange}
                      type="text"
                      name="movingInput"
                      value={movingInput}
                      ref={subItemTxt}
                    />
                    <button
                      className={submitClass}
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
                  showInpu={showmovingInput}
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
                    className={submitClass}
                    onChange={handleMovingInputChange}
                    type="text"
                    name="movingInput"
                    value={movingInput}
                    ref={subItemTxt}
                  />
                  <button
                    className={submitClass}
                    onClick={e => {
                      handleSubItemSubmit(e, [...parInd, index]);
                    }}
                    type="submit"
                    name="subItemButton"
                  >
                    <i className="fas fa-plus-circle"></i>
                  </button>
                </form>
              )}
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
        {listTitle
          ? listTitle + " list"
          : "Unnamed list (hover over to change)"}
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
          <i className="fas fa-plus-circle"></i>
        </button>
      </form>
    </div>
  );
}
