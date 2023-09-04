const express = require('express');
const cors = require('cors');
const app = express();
const User = require('./models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

// hash
const salt = bcrypt.genSaltSync(10);
const secret = 'hhakjajjiefvhfireuwoieh';

app.use(cors({credentials:true, origin:'http://localhost:5173'}));
app.use(express.json());
app.use(cookieParser())

// mongoose.connect(''); put your own mongodb string


app.post('/register', async (req, res) => {
  const {email, username, password } =req.body;
  const userDoc = await User.create({
    email,
    username,
    password:bcrypt.hashSync(password, salt)
  });
  res.json(userDoc);
});

app.post('/login', async (req,res) => {
  const { username, password } =req.body;

  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    jwt.sign({
      username,
      id:userDoc._id
    },
    secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json('ok')
    }
    )
  } else {
    res.status(400).json('Wrong Credentials')
  }
});

app.listen(4000);