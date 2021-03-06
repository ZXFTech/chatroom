var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

const url ="mongodb://localhost:9000";

const dbName = 'myproject';

const client = new MongoClient(url);

client.connect(function(err){
    assert.equal(null,err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    insertDocuments(db,function(){
        findDocuments(db,function( ){
            client.close();
        })
    });
});

const insertDocuments = function(db,callback) {
    const collection = db.collection('document');

    collection.insertMany([
        {a:1},{a:2},{a:3}
    ],function(err,result){
        assert.equal(err,null);
        assert.equal(3,result.result.n);
        assert.equal(3,result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
};

const findDocuments = function(db,callback) {
    const collection = db.collection('document');
    collection.find({a:3}).toArray(function(err,docs){
        assert.equal(err,null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
}
