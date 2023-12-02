const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 2410;


app.use(cors());
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true"); 
  next();
});
const cookieParser=require("cookie-parser");
app.use(cookieParser());
// app.use(authenticatetoken);
const jwt=require("jsonwebtoken");
const jwt_key="secretkey237483";
const jwtExpiryTime=300;
let {users,orders}=require("./data-2.js");
let cookieName="jwtToken";
app.get("/",function(req,res){
  res.send("Server running fine")
})
function authenticatetoken(req,res,next){
    console.log(req.headers);
    const token =req.cookies[cookieName];
    console.log("Token:",token);
    if(!token) res.status(401).send("Please login first");
    else {
        jwt.verify(token,jwt_key,function(err,data){
            if(err) res.status(403).send(err);
            else{
                console.log(data);
                req.user=data.user;
               next();
            }
        })
    }
}

app.post("/login", function (req, res) {
  let { username, password } = req.body;
 let user =users.find(u=>u.name===username &&u.password==password);
  if (user) {
 const token=jwt.sign({user},jwt_key,{
algorithm:"HS256",
expiresIn:jwtExpiryTime,});
res.cookie(cookieName,token);
res.send({ token });
 }

   
    else res.status(401).send("Login Failed")
});
app.get("/myOrders",authenticatetoken,function(req,res){
 
            let orders1=orders.filter(ord=> ord.userId===req.user.id)

       res.send(orders1);
})
app.get("/info",function(req,res){
  res.send("Hello Welcome to the tutorial");
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
