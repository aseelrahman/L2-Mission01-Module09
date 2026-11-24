import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  //* check if the user exists -> Done
  //* check if the password match => Done
  //* check the user status -> Done
  //? If pass all then generate jwt token

  const { email, password } = payload;

  const user = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );

  //   console.log(user.rows[0]);
  if (user.rowCount === 0) {
    throw new Error("Invalid credentials!!");
  }

  const matchPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassword) {
    throw new Error("Invalid credentials!!");
  }

  // console.log(matchPassword);

  if (!user.rows[0].is_active) {
    throw new Error("Access Denied!");
  }
  delete user.rows[0].password;

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
  });

    const refreshToken = jwt.sign(jwtPayload, config.refresh_secret, {
      expiresIn: "10d",
    });

  return { accessToken, refreshToken, user: user.rows[0] };
};

export const authService = {
  loginUserIntoDB,
};
