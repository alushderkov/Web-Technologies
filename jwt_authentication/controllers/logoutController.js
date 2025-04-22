const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) { this.users = data; }
}

const fsPromises = require("fs").promises;
const path = require("path");
const fs = require("node:fs");

const handleLogout = async (req, res) => {
  // On client also delete the access token
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  // is refreshToken in DB?
  const foundUser =  usersDB.users.find(person => person.refreshToken === refreshToken);

  if (!foundUser) {
    res.clearCookie( "jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } );
    return res.status(204);
  }

  // delete refreshToken in DB
  const otherUsers = usersDB.users.filter( (person) => {
    return person.refreshToken !== foundUser.refreshToken
  });
  const currentUser = { ...foundUser, refreshToken: '' };

  usersDB.setUsers( [...otherUsers, currentUser] );

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie( "jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } );
  // then secure: true - only servers on https

  res.sendStatus(204);
}

module.exports = { handleLogout };