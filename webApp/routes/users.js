const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user data
router.put('/:id', async(req,res) => {
    if ( req.body.userId == req.params.id ) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }

      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set:req.body,
        });
        res.status(200).json("Account updated");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("Cannot update non-owned account");
    }
});

//delete user
router.delete('/:id', async(req,res) => {
  if ( req.body.userId == req.params.id ) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("Cannot delete non-owned account");
  }
});

//get a user
router.get('/:id', async(req,res) => {
  try {
    const user = await User.findById(req.params.id);
    const {password,currentAccToken, ...others} = user._doc;
    res.status(200).json(others);
  } catch(err) {
    res.status(500).json(err);
  }
});

//update preferences
router.put('/:id/prefs', async(req,res) => {
  if (req.body.userId == req.params.id ) {
    try {
      const user = await User.findById(req.params.id);
      const currUsers = await User.findById(req.body.userId);

    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cannot change others' preferences");
  }
})


module.exports = router;
