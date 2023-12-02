const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 2410;
let LocalStrategy=require("passport-local");
let {users,orders}=require ("./data-2");
const passport = require("passport");

app.use(cors());
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true"); 
  next();
});
app.use(passport.initialize());
let strategyAll=new LocalStrategy(function (username,password,done){
    let user=users.find((u)=>u.name===username && u.password===password);
    console.log("user",user);
    if(!user)
    return done (null,false,{message:"Incorrect username or password"})
else return done(null,user);
})
let strategyAdmin=new LocalStrategy(function (username,password,done){
    let user=users.find((u)=>u.name===username && u.password===password);
    console.log("user",user);
    if(!user)
    return done (null,false,{message:"Incorrect username or password"})
else if(user.role!=="admin") return done(null,false,{message:"You do not have admin role"})
else return done(null,user);
})
passport.use("roleAll",strategyAll);
passport.use("roleAdmin",strategyAdmin);

app.post("/user",function (req,res){
    let{username,password}=req.body;
    let user=users.find((u)=>u.name===username&&u.password===password);
    if(user){
        let payload={id:user.id};
        res.send(payload)
    }else res.sendStatus(401);
})

app.get("/user",passport.authenticate("roleAll",{session:false}),function(req,res){
    console.log("In GET /user",req.user);
    res.send(req.user);
})
app.get("/myOrders",passport.authenticate("roleAll",{session:false}),function (req,res) {
    console.log("In GET /myOrders",req.user.id);
    let orders1=orders.filter((ord)=>ord.userId===req.user.id)
    res.send(orders1);
    
})

app.get("/allOrder",passport.authenticate("roleAdmin",{session:false}),function(req,res){
    console.log("In GET /allorder",req.user)
    res.send(orders);
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });