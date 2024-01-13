const jwt = require("jsonwebtoken");

const generateUserToken = (user) => {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

const generateContractorToken = (contractor) => {
  const payload = {
    _id: contractor._id,
    name: contractor.name,
    address: contractor.address,
    email: contractor.email,
    projectType: contractor.projectType,
    role: "contractor",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

const generateStackholderToken = (stackholder) => {
  const payload = {
    _id: stackholder._id,
    name: stackholder.name,
    email: stackholder.email,
    position: stackholder.role,
    role: "stakeholder",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token;
};

module.exports = {
  generateUserToken,
  generateContractorToken,
  generateStackholderToken,
};
