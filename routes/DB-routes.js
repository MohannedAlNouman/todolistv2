const passport = require("passport");
const List = require("../models/listSchema");
const User = require("../models/userSchema");
const dbRouter = require("express").Router();

//checks if a user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    //user not logged in, send status code 401 (unauthorized access)
    res.sendStatus(401);
  }
};

//gets specific list
dbRouter.get("/:listID", isLoggedIn, (req, res) => {
  const id = req.params.listID;
  List.findById(id, (err, foundList) => {
    res.send(foundList);
  });
});

//saves new list
dbRouter.post("/", isLoggedIn, (req, res) => {
  const newList = new List(req.body);
  newList.save(err => {
    User.findOne(
      {
        googleId: req.user.googleId
      },
      (err, user) => {
        user.lists = [
          ...user.lists,
          {
            listName: req.body.name,
            listId: newList._id
          }
        ];
        user.save(err => {
          res.send(newList._id);
        });
      }
    );
  });
});

//updates specific list
dbRouter.post("/:listID", isLoggedIn, (req, res) => {
  const id = req.params.listID;
  List.findById(id, (err, foundList) => {
    foundList.name = req.body.name;
    foundList.items = req.body.items;
    foundList.save(err => {
      User.findOne(
        {
          googleId: req.user.googleId
        },
        (err, user) => {
          for (let i = 0; i < user.lists.length; i++) {
            if (user.lists[i].listId == id) {
              user.lists[i].listName = req.body.name;
              break;
            }
          }
          user.save();
        }
      );
    });
  });
});

//deletes specific list
dbRouter.delete("/:listID", isLoggedIn, (req, res) => {
  const id = req.params.listID;
  List.deleteOne(
    {
      _id: id
    },
    err => {
      User.findOne(
        {
          googleId: req.user.googleId
        },
        (err, user) => {
          user.lists = user.lists.filter((element, index) => {
            return element.listId !== id;
          });
          user.save(err => {
            res.send(user.lists);
          });
        }
      );
    }
  );
});

module.exports = dbRouter;
