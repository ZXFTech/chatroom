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

    insertDocument([{a:1}],'testCollection',function() {
        disconnect();
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
