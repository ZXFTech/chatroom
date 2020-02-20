var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/',function(req,res) {
    res.sendFile(__dirname+'/index.html');
});

io.on('connection',function(socket){
    console.log('connection');

    socket.on('message',function(msg) {
        io.emit('message',msg);
        console.log(msg);
    });

});


http.listen(8888,function(){
    console.log('listening on *:3000');
});
