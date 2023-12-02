const express = require('express');
const cors = require("cors");
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'yourSecretKey123';
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true"); 
    next();
  });

app.get('/getToken', (req, res) => {

  const payload = {
    user_id: 123,
    role: 'admin',
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); 
  res.json({ token });
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: 'Token not provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    req.decoded = decoded;
    next();
  });
};


app.get('/students', verifyToken, (req, res) => {

  const students = [
    { id: 1, name: 'Joe' },
    { id: 2, name: 'Jim' },
    { id: 3, name: 'Mary' },
  ];

  res.json({ students });
});

const PORT = process.env.PORT || 2410;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
