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

// 各数据集合名称
var userCollection = 'colUsers';
var recordsCollection = 'colChatRecords';

// Create a new mongoClient
var client = new MongoClient(url,{useUnifiedTopology: true});

//  连接mongoDB数据库服务
client.connect(function(err) {
    assert.equal(null,err);
    console.log("Connected successfully to mongodb server");

    db = client.db(dbName);
});

app.use(express.static('static'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

io.on('connection', function(socket) {
    console.log('connection');

    // var recentRecords = findDocuments();
    var recentRecords;

    socket.emit('sendRecentRecords',recentRecords);

    // 收到消息
    socket.on('message', function(messageChunk) {
        // console.log(socket.toString());
        socket.broadcast.emit('message', messageChunk);
        insertDocument([messageChunk],recordsCollection,function(result) {
            if (result.result.ok == 1) {
                console.log('Message recorded.');
            }
        })
    });

    // 注册
    socket.on('register',function(userStatus) {
        var user = new User(userStatus);
        findDocuments({'username':user.username},'testCollection',function(result){
            if (result.length) {
                socket.emit('regFailed','该用户名已存在.');
            }
            else {
                insertDocument([user],'testCollection',function(result) {
                    console.log(result.result.ok);
                    if (result.result.ok==1) {
                        console.log(user.username);
                        socket.emit('logOrRegSuccessfully',user);
                    }
                    else {
                        socket.emit('regFailed','出现问题，请稍后再试。');
                    }
                });
                console.log(user);
            }
        })
    });

    // 登录
    socket.on('login',function(userStatus) {
        console.log('someone try to login');
        var loginUser = new User(userStatus);
        var user; findDocuments({'username':loginUser.username},'testCollection',function(result) {
            if (result.length) {
                if (result[0].password === loginUser.password) {
                    socket.emit('logOrRegSuccessfully',result[0]);
                }
                else {
                    socket.emit('logFailed','密码不正确！');
                }
            }
            else {
                socket.emit('logFailed','用户名不存在！');
            }
        });

    })
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
    collection.find(filter).toArray(function(err,docs){
        assert.equal(err,null);
        callback(docs);
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
    this.username=userStatus.username;
    this.password=userStatus.password;
    this.icon='/images/usericons/akari.jpg';
    this.level=1;
}
