const fs = require('fs')


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

function check_password(username, password) {
  users = load_user_file();
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username) {
      if (users[i].password == password) {
        return true;
      }
    }
  }
  return false;
}

function add_user(username, password) {
  users = load_user_file();
  newdata =
  {
    "username": username,
    "password": password
  }
  users.push(newdata);
  save_user_file(users);
}

module.exports = { add_user, check_username, check_password }