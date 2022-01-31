const express = require('express');
const router = express();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');

router.get('/', auth, (req, res) => {
  res.send('Auth route');
});

// Post request
// authenticate user

router.post(
  '/',
  [
    check('email', 'Please enter valid credentials').isEmail(),
    check('password', 'Please enter valid credentials').exists(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body;

    try {
      // Verify User's Email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Please enter valid credentials' });
      }

      // Verify User's Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Please enter valid credentials' });
      }

      // JWT token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('JWTSECRET'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error);
      return res.status(400).json({ msg: 'Internal server error' });
    }
  }
);

//show user details

module.exports = router;
