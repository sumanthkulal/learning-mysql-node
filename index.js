const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express=require('express');
const app=express();
const path=require("path");
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Sk@20041',
  
});

let getRandomUser=()=>{
  return [
     faker.string.uuid(),
     faker.internet.username(), // before version 9.1.0, use userName()
     faker.internet.email(),
     faker.internet.password(),
  ];
}

app.get("/home",(req,res)=>{
  let q=`select count(*) FROM user`;
  try{
  connection.query(q,(err,result)=>{
    if(err)
      throw err;
    let count=result[0]["count(*)"];
    res.render("home.ejs",{count});
  });
}
catch(err){
  console.log(err);
  res.send(" erro!");
}
});

app.get("/user",(req,res)=>{
  let q=`SELECT *FROM user`;
  try{
    connection.query(q,(err,users)=>{
      if(err)
        throw err;
      // console.log(user);
      res.render("user.ejs",{users});
    })
  }
  catch(err){
    res.send("somee error");
  }
}); 

app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT *FROM user WHERE userId='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err)
        throw err;
        // res.send(result);
      let user=result[0];
      res.render("edit.ejs",{user});
    });
  }
  catch(err){
    res.send("somee error");
  }
});

app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {password:formPass,username:newUsername}=req.body;
  let q=`SELECT *FROM user WHERE userId='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err)
        throw err;
      let user=result[0];
      if(formPass!=user.password){
        res.send("WRONG password");
      }
      else{
        let q2=`UPDATE user SET username='${newUsername}' WHERE userId='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err)
            throw err;
          res.redirect("/user");
        })
      }
    });
  }
  catch(err){
    res.send("somee error");
  }
});

 app.listen("8080",()=>{
  console.log("server is listening to port 8080");
 });


