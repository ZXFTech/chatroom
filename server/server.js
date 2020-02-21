var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('connection');
    // console.log('用户分配中...');
    // var user = userList.pop();
    // console.log('登录用户为:',user.name);

    socket.on('message', function(msg) {
        console.log(socket.toString());
        socket.broadcast.emit('message', msg);
        console.log(msg);
    });
});


http.listen(8888, function() {
    console.log('listening on *:3000');
});

var userList = [{
    name: "Conan",
    level: 2,
    icon: "./images/usericons/conan.jpg"
}, {
    name: "Naruto",
    level: 1,
    icon: "./images/usericons/naruto.jpg"
}];

var myself = {
    name: "Naruto",
    level: 1,
    icon: "./images/usericons/naruto.jpg"
}

var conan = {
    name: "Conan",
    level: 2,
    icon: "./images/usericons/conan.jpg"
}
