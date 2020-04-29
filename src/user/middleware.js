const bcrypt = require("bcryptjs");
const User = require("./model");

const encryptPassword = async (req, res, next) => {
  const { password = null } = req.body;

  if (password) {
    const password_hash = await bcrypt.hash(password, 10);

    req.body.password_hash = password_hash;
  }

  return next();
};

const checkAccountStatus = async (req, res, next) => {
  const { auth_user_id } = req;

  const user = await User.getOne(auth_user_id);

  if (user && user.deleted_at) {
    return res.json({
      error: 403,
      data: {
        message: "Your user account is disabled",
      },
    });
  }

  return next();
};

module.exports = { checkAccountStatus, encryptPassword };
