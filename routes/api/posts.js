const express = require('express');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const router = express();

router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      return res.status(400).json('Internal Server Error');
    }
  }
);

module.exports = router;
