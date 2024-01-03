const fs = require('fs');
const bcrypt = require('bcrypt');

const filename = './users.json';
const testdata =
  [
    {
      "username": "testname",
      "password": "testpassword"
    }
  ];

function load_user_file() {
  let obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
  if (obj == null) {
    obj = testdata;
    save_user_file(obj);
    console.log("There was no data in the users file.")
  }
  return obj;
}

function save_user_file(newdata) {
  fs.writeFileSync(filename, JSON.stringify(newdata))
}

function check_username(username) {
  users = load_user_file();
  let result = false;
  users.forEach((user) => {
    if (user.username == username) {
      result = true;
    }
  });
  return result;
}

async function check_password(username, password) {
  let users = load_user_file();
  let valid = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username) {
      valid = await bcrypt.compare(password, users[i].password);
    }
  }
  return valid;
}

async function add_user(username, password) {
  users = load_user_file();
  const new_pass = await bcrypt.hash(password, 5);
  newdata =
  {
    "username": username,
    "password": new_pass
  }
  users.push(newdata);
  save_user_file(users);
}

module.exports = { add_user, check_username, check_password }