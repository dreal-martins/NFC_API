const crypto = require("crypto");

function generateRandomPassword(length) {
  if (!length || length <= 0) {
    throw new Error("Password length must be a positive number");
  }

  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}

module.exports = generateRandomPassword;
