const express = require("express");
const cors = require("cors");
const jwt=require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 2410;
let JWTStrategy=require("passport-jwt").Strategy;
let ExtractJWT=require("passport-jwt").ExtractJwt
let {users,orders}=require ("./data-2");
const passport = require("passport");

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, authorization, Content-Type, Accept',
    credentials: true,
  };
  
  app.use(cors(corsOptions));
app.use(passport.initialize());
const params={
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:"jwtsecret23647832"
}
const jwtExpirySeconds=300;
let strategyAll=new JWTStrategy (params,function (token,done){
    console.log("In JWTstrategy-All",token);
    let user=users.find((u)=>u.id===token.id);
    console.log("user",user);
    if(!user)
    return done (null,false,{message:"Incorrect username or password"})
else return done(null,user);
})
let strategyAdmin=new JWTStrategy (params,function (token,done){
    console.log("In JWTstrategy-Admin",token);
    let user=users.find((u)=>u.id===token.id);
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
        let token =jwt.sign(payload,params.secretOrKey,{algorithm:"HS256",expiresIn:jwtExpirySeconds});
        res.send( {token: "bearer "+ token});
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