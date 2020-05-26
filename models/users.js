const bcrypt = require("bcrypt");
const { mongoConnection } = require("./connection");
/**
 * @addUser
 */

function addUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      // check if user does not exists
      let checkUserData = await checkIfUserExists({ email: userData.email });
      if (checkUserData.data && checkUserData.data.length > 0) {
        // user already exists, send response
        return resolve({
          error: true,
          message: "User already exists with this credentials. Please login",
          data: [],
        });
      }
      // generate password hash
      let passwordHash = await bcrypt.hash(userData.password, 15);
      userData.password = passwordHash;

      // add new user
      mongoConnection
        .collection("users")
        .insertOne(userData, async (err, results) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          //return data
          resolve({
            error: false,
            data: results.ops[0],
          });
        });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * @verifyUser
 * @param {*} userData
 */

function verifyUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      let userDatafromDb = await checkIfUserExists({ email: userData.email });
      if (userDatafromDb.data && userDatafromDb.data.length > 0) {
        // user already exists, verify the password
        let passwordVerification = await bcrypt.compare(
          userData.password,
          userDatafromDb.data[0].password
        );
        if (!passwordVerification) {
          // password mismatch
          return resolve({
            error: true,
            message: "Invalid email or password",
            data: [],
          });
        }
        // password verified
        return resolve({ error: false, data: userDatafromDb.data[0] });
      } else {
        return resolve({
          error: true,
          message:
            "There is no user exists with this credentials. Please create a new account.",
          data: [],
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}

/**
 * @checkIfUserExists
 */

function checkIfUserExists(userData) {
  return new Promise((resolve, reject) => {
    try {
      // check if user exists
      mongoConnection
        .collection("users")
        .find({ email: userData.email })
        .toArray((err, results) => {
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          resolve({ error: false, data: results });
        });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  addUser: addUser,
  verifyUser: verifyUser,
};
