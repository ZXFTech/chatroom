var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// connection url
var url = 'mongodb://localhost:9000';

// Database Name
var dbName = 'chatroom';

// DataBase
var db;

// Create a new mongoClient
var client = new MongoClient(url,{useUnifiedTopology: true});

// Use connect method to connect to the server
client.connect(function(err) {
    assert.equal(null,err);
    console.log("Connected successfully to server");

    db = client.db(dbName);
});

app.use(express.static('static'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

io.on('connection', function(socket) {
    console.log('connection');
    // console.log('用户分配中...');
    // var user = userList.pop();
    // console.log('登录用户为:',user.name);

    socket.on('message', function(user,msg) {
        // console.log(socket.toString());
        socket.broadcast.emit('message', user,msg);
        console.log(msg);
    });

    socket.on('register',function(userStatus) {
        var user = new User(userStatus);
        insertDocument([user],'testCollection',function(result) {
            console.log(result.result.ok);
            if (result.result.ok==1) {
                console.log(user.username);
                socket.emit('regSuccessfully',user);
            }
            else {
                socket.emit('regFailed');
            }
        });
        console.log(user);
    });
});

// insert document
function insertDocument(insertDocument,collectionName,callback) {
    // Get the documents collection
    var collection = db.collection(collectionName);

    collection.insertMany(insertDocument,function(err,result) {
        assert.equal(null,err);
        console.log("Inserted successfully.");
        callback(result);
    });
}

// 查找
function findDocuments(filter,collectionName,callback) {
    var collection = db.collection(collectionName);

    collection.find(filter).toArray(function(err,items) {
        assert.equal(null,err);
        assert.equal(4,items.length);
    });
}

// 更新
function updateDocument(filter,update,collectionName,callback) {
    var collection = db.collection(collectionName);

    collection.updateOne(
        filter,
        update,
        function(err,result) {
            assert.equal(err,null);
            callback(result);
        }
    );
}

// 删除
function removeDocument(filter,collectionName,callback) {
    var collection = db.collection(collectionName);

    collection.deleteOne(filter,function(err,result){
        assert.equal(err,null);
        console.log("Removed successfully.");
    });
}

// 创建索引
function indexCollection(filter,collectionName,callback){
    db.collection(collectionName).createIndex(
        filter,
        function(err,results) {
            console.log(results);
            callback();
        }
    );
}

// 断开连接
function disconnect() {
    client.close();
}

http.listen(8888, function() {
    console.log(__dirname);
    console.log('listening on *:8888');
});

function User(userStatus) {
    this.username=userStatus.userName;
    this.password=userStatus.password;
    this.icon='/images/usericons/akari.jpg';
    this.level=1;
}

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
