const User = require("./model");

const create = async (req, res) => {
  const {
    name = null,
    username = null,
    password_hash = null,
    email = null,
    phone = null,
  } = req.body;

  if (!name || !username || !password_hash || !email || !phone) {
    return res.status(400).json({
      error: 400,
      data: {
        message: "Bad Format",
      },
    });
  }

  const data = {
    name,
    username,
    email,
    phone,
    password_hash,
  };

  const response = await User.store(data);

  if (response && response.error) {
    return res.status(response.error).json(response);
  }

  return res.status(201).json({
    error: null,
    data: response,
  });
};

const getUserProfile = async (req, res) => {
  const { auth_user_id } = req;

  const {
    password_hash,
    google_id,
    facebook_id,
    document_id,
    ...user
  } = await User.getOne(auth_user_id);

  if (!user) {
    return res.status(404).json({
      error: 404,
      data: {
        message: "Not Found",
      },
    });
  }

  return res.json({
    error: null,
    data: user,
  });
};

const getProfile = async (req, res) => {
  const { id = null } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 400,
      data: {
        message: "Bad Format",
      },
    });
  }

  const { id: user_id = null, name = null } = await User.getOne(id);

  if (!user_id || !name) {
    return res.status(404).json({
      error: 404,
      data: {
        message: "Not Found",
      },
    });
  }

  return res.json({
    error: null,
    data: {
      id: user_id,
      name: name,
    },
  });
};

const update = async (req, res) => {
  const { auth_user_id, body: {
    email = null,
    username = null,
    phone = null,
    name = null,
    password_hash = null,
  }} = req;
  
  const user = await User.getOne(auth_user_id);

  if (email) {
    const emailExists = await User.getOneByEmail(email);

    if (emailExists) {
      return res.json({
        error: 409,
        data: {
          message: "There is already an user with this email",
        },
      });
    }
  }
  const data = {
    id: auth_user_id,
    email: email ? email : user.email,
    username: username ? username : user.username,
    phone: phone ? phone : user.phone,
    name: name ? name : user.name,
  };

  const { deleted_at, created_at, updated_at } = await User.update({
    ...data,
    password_hash: password_hash ? password_hash : user.password_hash,
  });

  return res.json({
    error: null,
    data: {
      ...data,
      deleted_at,
      created_at,
      updated_at,
    },
  });
};

const confirm = async () => {};

const disable = async (req, res) => {
  const { auth_user_id = null } = req;

  const { deleted_at } = await User.getOne(auth_user_id);

  if (deleted_at) {
    return res.json({
      error: 400,
      data: {
        message: "You user account is already disabled.",
      },
    });
  }

  await User.disable(auth_user_id);

  return res.json({
    error: null,
    data: {
      message: "Your user account is now disabled.",
    },
  });
};

const upload = async (req, res) => {
  const { file, auth_user_id: user_id } = req;
  
  const picture = await User.upload({ url: file.filename, user_id });

  if (!picture || picture.error) {
    return res.json(picture);
  }

  return res.json({
    error: null,
    data: {
      url: picture.url,
    },
  });
};

module.exports = { create, getUserProfile, getProfile, update, disable, upload };
