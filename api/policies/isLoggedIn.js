// policies/isLoggedIn.js
const jwt = require('jsonwebtoken');
module.exports = async function (req, res, proceed) {
  const token = req.headers.authorization;

  jwt.verify(token, sails.config.session.secret, async (_err, decoded) => {
    if (_err) {
      return res.forbidden();
    }

    const { id } = decoded;
    const user = await User.findOne({ id: id });

    if (!user) {
      return res.forbidden({ messageCode: 'unauthorized' });
    }

    if (!user.isActive) {
      return res.forbidden({ messageCode: 'unauthorized' });
    }

    return proceed();
  });
};
