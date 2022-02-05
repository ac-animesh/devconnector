const express = require('express');
const router = express();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//  @Check Profile
//  @Get request
//  @Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.send(profile);
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: 'Internal Server Error' });
  }
});

//  @Create Profile
//  @Post request
//  @Private

router.post(
  '/',
  [auth, check('status').not().isEmpty()],
  [auth, check('skill').exists()],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(401).json({ error: error.array() });
    }

    const {
      company,
      website,
      location,
      status,
      githubusername,
      skill,
      twitter,
      instagram,
    } = req.body;

    // Profile Fields
    const profileField = {};
    profileField.user = req.user.id;
    if (company) profileField.company = company;
    if (website) profileField.website = website;
    if (location) profileField.location = location;
    if (status) profileField.status = status;
    if (githubusername) profileField.githubusername = githubusername;
    if (skill)
      profileField.skill = skill.split(',').map((skill) => skill.trim());

    // Social Fields
    profileField.social = {};
    if (twitter) profileField.social.twitter = twitter;
    if (instagram) profileField.social.instagram = instagram;

    // Update Profile
    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate({
          user: req.user.id,
          $set: profileField,
          new: true,
        });
        return res.json(profile);
      }

      // Save New/Updated Profile
      profile = new Profile(profileField);
      profile.save();
    } catch (error) {
      console.error(error);
      res.status(400).json({ msg: 'Internal Server Error' });
    }

    res.send(profileField);
  }
);

// @route   GET/ Profile
// @desc    Get all the profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    if (!profiles) {
      return res.status(400).json({ msg: 'No profile found' });
    }

    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(400).json('Internal Server Error');
  }
});

// @Route  DELETE api/profile
// @desc   Delete profile, user and post
// @access Private

router.delete('/', auth, async (req, res) => {
  try {
    // @todo Remove Post

    // Remove Profile
    await Profile.findOneAndDelete({ user: req.user.id });
    // Remove User
    await User.findOneAndDelete({ _id: req.user.id });
    res.json({ msg: 'User is deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(400).json('Internal Server Error');
  }
});

// @Route  PUT api/experience
// @desc   Add experience
// @access Private

router.put(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From is required').not().isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();

      res.json({ profile });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School filed is required').not().isEmpty(),
      check('degree', 'Degree filed is required').not().isEmpty(),
      check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
      check('from'),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { school, degree, fieldofstudy, from, to, current, description } =
        req.body;

      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      };

      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);

      await profile.save();
      res.json({ profile });
    } catch (error) {
      console.error(error.message);
      return res.status(400).json('Internal Server Error');
    }
  }
);

module.exports = router;
