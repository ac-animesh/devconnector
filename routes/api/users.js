const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar/lib/gravatar');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');

const router = express();
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'password should be more than 6 char').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const { name, email, password } = req.body;
    try {
      // See if user is exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'User is already exists' }] });
      }

      // Set gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Set password encrption
      const salt = await bcrpyt.genSalt(10);
      user.password = await bcrpyt.hash(password, salt);

      // Save data into DATABASE
      await user.save();

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
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
