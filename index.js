const express = require('express');
const app=express();

//connecting server
let server=require('./server');
let middleware=require('./middleware');

//body parser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//connection to mongodb
const MongoClient = require('mongodb').MongoClient;

const url='mongodb://127.0.0.1:27017';
const dbname='hosipitalmanagement';
let db
MongoClient.connect(url,(err,client)=>{
if(err) return console.log(err);
db=client.db(dbname);
console.log(`Connected MongoDB: ${url}`);
console.log(`Database: ${dbname}`);
});

//getting hospital details
app.get('/hospitaldetails',middleware.checkToken,(req,res)=>{
    console.log("fetching deatils from hospital collection");
    var data=db.collection('hospital').find().toArray().then(result =>res.json(result));
});

//ventilator details
app.get('/ventilatordetails',middleware.checkToken,(req,res)=>{
    console.log("fetching deatils from ventilator collection");
    var ventilatordetails=db.collection('ventilator').find().toArray().then(result =>res.json(result));
});
//searching ventilators by status
app.post('/ventbystatus',middleware.checkToken,(req,res) => {
    var status=req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventilator').find({"status":status}).toArray().then(result=>res.json(result));
});
//searching vent  by hospital name
app.post('/ventbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilator').find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});
//search hospital by name
app.post('/searchhosbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var hospitaldetails=db.collection('hospital').find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});
//update ventilator details
app.put('/updateventdetails',middleware.checkToken,(req,res)=>{
    var ventid={vid:req.body.vid};
    console.log(ventid);
    var values={$set:{status:req.body.status}};
    db.collection("ventilator").updateOne(ventid,values,function(err,result){
        res.json('1 document updated');
        if(err) throw err;
    });
});
//add ventilator
app.post('/addventbyuser',middleware.checkToken,(req,res)=>{
    var hid=req.body.hid;
    var vid=req.body.vid;
    var status=req.body.status;
    var name=req.body.name;
    var item=
    {
        hid:hid,vid:vid,status:status,name:name
    };
    db.collection('ventilator').insertOne(item,function(err,result){
        res.json('item inserted');
        if(err) throw err;
    });
});
//delete ventilator by vid
app.delete('/deleteventdetails',middleware.checkToken,(req,res)=>{
    var del=req.query.vid;
    console.log(del);
    var del1={vid:del};
    db.collection("ventilator").deleteOne(del1,function(err,obj){
        if(err) throw err;
        res.json('1 document deleted');
    });
});
app.listen(1300);