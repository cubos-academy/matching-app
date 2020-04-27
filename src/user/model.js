const Pool = require("../utils/db");

const DEFAULT_ERR_RESPONSE = {
  error: 503,
  data: {
    message: "Internal Error",
  },
};

const store = async (user) => {
  const { name, username, email, password_hash, phone } = user;

  const userExists = await getOneByEmail(email);

  if (!userExists) {
    try {
      const {
        rows,
      } = await Pool.query(
        "INSERT INTO users (name, username, email, password_hash, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, username, email, password_hash, phone]
      );

      if (!rows.length) {
        return DEFAULT_ERR_RESPONSE;
      }

      return rows.shift();
    } catch (err) {
      return DEFAULT_ERR_RESPONSE;
    }
  }

  return {
    error: 409,
    data: {
      message: "There is already an user with this email",
    },
  };
};

const getOneByEmail = async (email) => {
  try {
    const {
      rows,
    } = await Pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1 AND deleted_at IS NULL",
      [email]
    );

    if (!rows.length) {
      return null;
    }

    return rows.shift();
  } catch (err) {
    return DEFAULT_ERR_RESPONSE;
  }
};

const getOne = async (id) => {
  try {
    const { rows } = await Pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    return rows.shift();
  } catch (err) {
    return {
      error: 503,
      message: "Internal Error",
    };
  }
};

const update = async (user) => {
  const { id, email, password_hash, username, phone, name } = user;
  try {
    const {
      rows,
    } = await Pool.query(
      "UPDATE users SET email = $1, password_hash = $2, username = $3, phone = $4, name = $5, updated_at = NOW() WHERE id = $6 RETURNING *",
      [email, password_hash, username, phone, name, id]
    );

    return rows.shift();
  } catch (err) {
    return DEFAULT_ERR_RESPONSE;
  }
};

const getAll = () => {
  
};

const disable = async (id) => {
  try {
    const {
      rows,
    } = await Pool.query(
      "UPDATE users SET deleted_at = NOW() where id = $1", [id]
    );

    return rows.shift();
  } catch (err) {
    return DEFAULT_ERR_RESPONSE;
  }
};
module.exports = { store, getOne, getOneByEmail, getAll, disable, update };
