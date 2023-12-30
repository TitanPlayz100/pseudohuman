const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const fs = require('fs')
const { Server } = require('socket.io')
const io = new Server(server, { cors: { origin: '*' } });

// USER DATA SAVING AND RETRIEVING
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

// MATCHMAKING ARRAY
let matchingUsers = [];

// WEBSOCKET CONNECTIONS
io.on('connection', (socket) => {
  console.log("User joined");

  socket.on('check-user', (username) => {
    let result = check_username(username);
    io.emit('checked-username-' + username, { valid: result, user: username });
  });

  socket.on('check-password', (userobj) => {
    let username = userobj.username;
    let password = userobj.password;
    let result = check_password(username, password);
    io.emit('checked-password-' + username, result);
  });

  socket.on('register-user', (userobj) => {
    let username = userobj.username;
    let password = userobj.password;
    add_user(username, password);
    io.emit('registered-user-' + username, true);
  });

  socket.on('enter-matchmaking', (username) => {
    matchingUsers.push(username);
    const count = matchingUsers.length;
    io.emit('entered-matchmaking-' + username, count);
  });


  socket.on('disconnect', () => {
    matchingUsers = [];
  });

});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});