const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const fs = require('fs')
const { Server } = require('socket.io')
const io = new Server(server, { cors: { origin: '*' } });

// USER DATA SAVING AND RETRIEVING
const filename = './users.json'
const testdata =
  [
    {
      "username": "testname",
      "password": "testpassword"
    }
  ];
let messageArray = ['test1', 'test2'];

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
      console.log("found match")
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

// WEBSOCKET CONNECTIONS
io.on('connection', (socket) => {

  console.log("user joined");
  // io.emit('send-message', messageArray);


  socket.on('sent-message', (message) => {
    messageArray = [...messageArray, message]
    io.emit('send-message', messageArray);
  });

  socket.on('check-user', (username) => {
    result = check_username(username);
    io.emit('checked-username', { valid: result, user: username });
  });

  socket.on('check-password', (userobj) => {
    username = userobj.username;
    password = userobj.password;
    result = check_password(username, password);
    io.emit('checked-password', result);
  });

  socket.on('register-user', (userobj) => {
    username = userobj.username;
    password = userobj.password;
    result = add_user(username, password);
    io.emit('registered-user', true);
  });


  socket.on('disconnect', () => {
    console.log('user left')
  });

});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});