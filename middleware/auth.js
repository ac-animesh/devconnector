const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  //Get Token from header
  const token = req.header('auth-token');

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization is denied' });
  }

  //Verfiy token
  try {
    const decoded = jwt.verify(token, config.get('JWTSECRET'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
