const passport = require('passport');
const List = require('../models/listSchema');
const User = require('../models/userSchema');
const dbRouter = require("express").Router();

dbRouter.get('/:listID', (req, res) => {
  const id = req.params.listID;
  List.findById(id, (err, foundList) => {
    res.send(foundList);
  });
});

dbRouter.post('/:listID', (req, res) => {
  const id = req.params.listID;
  List.findById(id, (err, foundList) => {
    foundList.name = req.body.name;
    foundList.items = req.body.items;
    foundList.save((err) => {
      User.findOne({
        googleId: req.user.googleId
      }, (err, user) => {
        for (let i = 0; i < user.lists.length; i++) {
          if (user.lists[i].listId == id) {
            user.lists[i].listName = req.body.name;
            break;
          }
        }
        user.save();
      });
    });
  });
});

dbRouter.post('/', (req, res) => {
  const newList = new List(req.body);
  newList.save((err) => {
    User.findOne({
      googleId: req.user.googleId
    }, (err, user) => {
      user.lists = [...user.lists, {
        listName: req.body.name,
        listId: newList._id
      }];
      user.save((err) => {
        res.send(newList._id);
      });
    });
  });
});

dbRouter.delete('/:listID', (req, res) => {
  const id = req.params.listID;
  List.deleteOne({
    _id: id
  }, (err) => {
    User.findOne({
      googleId: req.user.googleId
    }, (err, user) => {
      user.lists = user.lists.filter((element, index) => {
        return (element.listId !== id)
      })
      user.save((err) => {
        res.send(user.lists)
      });
    });
  });
});

module.exports = dbRouter;
