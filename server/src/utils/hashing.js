import argon from "argon2";

// Hash password
export const hashPassword = async (password) => {
  return await argon.hash(password);
};

// Verify password
export const verifyPassword = async (password, hashedPassword) => {
  return await argon.verify(hashedPassword, password);
};
