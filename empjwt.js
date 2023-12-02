const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { DateTime } = require("luxon");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const app = express();
const PORT = 2410;
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, authorization, Content-Type, Accept',
    credentials: true,
  };
  
  app.use(cors(corsOptions));
  app.use(cookieParser());

// Sample employee data
const emps = [
    {empCode:1451,name:"Jack",department:"Finance",designation:"Manager",salary:52500,gender:"Male"},
    {empCode:1029,name:"Steve",department:"Technology",designation:"Manager",salary:71000,gender:"Male"},
    {empCode:1891,name:"Anna",department:"HR",designation:"Manager",salary:55100,gender:"Female"},
    {empCode:1322,name:"Kathy",department:"Operations",designation:"Manager",salary:49200,gender:"Female"},
    {empCode:1367,name:"Bob",department:"Marketing",designation:"Manager",salary:39000,gender:"Male"},
    {empCode:1561,name:"George",department:"Finance",designation:"Trainee",salary:22500,gender:"Male"},
    {empCode:1777,name:"Harry",department:"Technology",designation:"Trainee",salary:31000,gender:"Male"},
    {empCode:1606,name:"Julia",department:"HR",designation:"Manager",Trainee:25100,gender:"Female"},
    {empCode:1509,name:"Kristina",department:"Operations",designation:"Trainee",salary:19200,gender:"Female"},
    {empCode:1533,name:"William",department:"Marketing",designation:"Trainee",salary:16200,gender:"Male"},
    {empCode:1161,name:"Stephen",department:"Finance",designation:"VP",salary:82500,gender:"Male"},
    {empCode:1377,name:"Winston",department:"Technology",designation:"VP",salary:91000,gender:"Male"},
    {empCode:1206,name:"Victoria",department:"HR",designation:"Manager",VP:65100,gender:"Female"},
    {empCode:1809,name:"Pamela",department:"Operations",designation:"VP",salary:78600,gender:"Female"},
    {empCode:1033,name:"Tim",department:"Marketing",designation:"VP",salary:66800,gender:"Male"},
    {empCode:1787,name:"Peter",department:"Technology",designation:"Manager",salary:47400,gender:"Male"},
    {empCode:1276,name:"Barbara",department:"Technology",designation:"Trainee",salary:21800,gender:"Female"},
    {empCode:1859,name:"Donna",department:"Operations",designation:"Trainee",salary:21900,gender:"Female"},
    {empCode:1874,name:"Igor",department:"Operations",designation:"Manager",salary:48300,gender:"Male"},
    ]

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize());

const params={
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:"jwtsecret23647832"
}
const jwtExpirySeconds=300;
let strategyAll=new JwtStrategy (params,function (token,done){
    console.log("In JWTstrategy-All",token);
    const employee = emps.find(e => e.empCode === token.empCode);
    console.log("user",employee);
    if(!employee)
    return done (null,false,{message:"Incorrect username or password"})
else return done(null,employee);
})

passport.use("roleAll",strategyAll);
app.use((req, res, next) => {
    const trackerData = req.cookies.tracker || [];
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, params.secretOrKey);
            const user = emps.find(e => e.empCode === decoded.empCode);
          
            if (user) {
                trackerData.push({
                    name: user.name,
                    empCode: user.empCode,
                    url: req.originalUrl,
                    date: DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss"),
                });
            }
      

        } catch (error) {
            // Handle JWT verification error
            console.error("JWT verification error:", error);
        }
    }
    else{
        trackerData.push({
            name: 'Guest',
            empCode: 'Guest',
            url: req.originalUrl,
            date: DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss"),
        });
    }

    res.cookie("tracker", trackerData, { httpOnly: true, sameSite: 'none', secure: true });
    next();
});
app.post('/login', (req, res) => {
  const { empCode, name } = req.body;
  const employee = emps.find(e => e.empCode === Number(empCode) && e.name === name);
console.log(employee);
  if(employee){
    let payload={empCode:employee.empCode,name:employee.name};
    let token =jwt.sign(payload,params.secretOrKey,{algorithm:"HS256",expiresIn:300});
    res.send( {token: "bearer "+ token});
}else res.sendStatus(401);
});

app.get('/myDetails', passport.authenticate('roleAll', { session: false }), (req, res) => {

  res.json(req.user);
});

app.get('/company', (req, res) => {
  res.send('Welcome to the Employee Portal of XYZ Company.');
});

app.get('/myJuniors', passport.authenticate('roleAll', { session: false }), (req, res) => {
    const empCode =req.user.empCode;
    const us = emps.find(
      (employee) => employee.empCode === Number(empCode)
    );
    console.log(us.designation);
    switch (us.designation) {
      case "VP":
        res.json(
          emps.filter(
            (emp) => emp.designation === "VP" || emp.designation === "Manager"
          )
        );
        break;
      case "Manager":
        let filteredarray = emps.filter(
          (emp) => emp.designation === "Trainee"
        );
  
        res.json(filteredarray);
  
        break;
      default:
        res.json({});
    }
  });
  app.get("/tracker", (req, res) => {
    const trackerData = req.cookies.tracker || [];
    res.send(trackerData);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
