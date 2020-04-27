const jwt = require("jsonwebtoken");

const checkAuthorization = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      error: 401,
      data: {
        message: "Unauthorized",
      },
    });
  }

  const [bearer, token] = authorization.split(" ");
  try {
    const verification = await jwt.verify(token, process.env.JWT_SECRET);
    req.body.auth_user_id = verification.id;
  } catch (err) {
    res.status(401).json({
      error: 401,
      data: {
        message: "Unauthorized",
      },
    });
  }
  return next();
};

module.exports = { checkAuthorization };
