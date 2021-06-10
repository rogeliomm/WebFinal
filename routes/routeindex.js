const { render } = require('ejs');
const express = require('express');
const router = express.Router();
//const Post = require('../model/post');
const User = require('../model/user');
const jwt = require("jsonwebtoken");
const verify = require("../middleware/verifyAccess");
var secret = process.env.LLAVE_SECRETA || "";
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')))

var translation = [];
var toTranslate = "";
var suffix = ".png";
var preffix = "/images/";

router.get('/',verify ,async function(req,res){
  //console.log("User id: " + req.userId);
  var email = req.userId;
  var user = await User.findOne({email:email});
  console.log(user);
  var name = user.name;
  var lastname = user.lastname;
  var id = user._id;
  var mode = user.mode;
  var history = user.history;
  res.render('index',{title: 'home', translation, suffix, preffix, name, lastname, id, mode, history});
});

// TRANSLATE
router.post('/translate/:id', async (req,res) =>{
  
  /*
  var input = req.body.text;
  var translationImages = [""];
  
  var letterNumber = /^[1-9a-zA-Z]+$/i;

  for(var i=0; i < input.length; i++)
  {
    if(letterNumber.test(input[i]))
    {
      console.log(input[i]);
      var imageName = input[i].concat(".png");
      translationImages.push(imageName);
    }

  }
  */
  
  var {id} = req.params;
  var user = await User.findOne({_id:id});

  toTranslate = req.body.text; 
  translation = toTranslate;

  if (toTranslate !== ''){
    user.history.push(toTranslate);
    await user.save();
  }

  res.redirect('/');
})


// LOG IN 
router.get('/login', async (req,res) => {
  translation = "";
  toTranslate = "";
  console.log("SECRET: " + secret);
  res.render('login', {title: 'login'})
} )

router.post('/login', async (req,res) => {
  var email = req.body.email;
  var password = req.body.password;

  var user = await User.findOne({email:email});

  if (!user) {
      return res.status(404).send("The user does not exist");
  }

  else {
    var valid = await user.validatePassword(password);
    if (valid) {
      var token = jwt.sign({id:user.email, permission:true},secret, {expiresIn: "1h"  } );
      console.log(token);
      res.cookie("token", token, {httpOnly:true,maxAge: 600000 })
      res.redirect('/');
    }
    else {
      console.log("Password is invalid");
      res.end("Invalid");
    }

  }
  res.redirect('/');
} )

// REGISTER NEW USER
router.get('/register', async (req,res) => {
  res.render('register', {title: 'register'})
} )

router.post('/register', async (req,res) => {
  //console.log(req.body);
  var user = new User(req.body);
  user.password = await user.encryptPassword(user.password);
  user.mode = 'light';
  
  await user.save();
  console.log(user);
  res.redirect('/login');
} )

// USER CONFIGURATION
router.get('/config/:id', async (req, res) => {
  var {id} = req.params;
  console.log(id);
  var user = await User.findOne({_id:id});
  var email = user.email;
  var password = user.password;
  var name = user.name;
  var lastname = user.lastname;
  var mode = user.mode;
  res.render('config', {id, email, password, name, lastname, mode});
})

router.post('/config/:id', async (req, res) => {
  var {id} = req.params;
  var user = await User.findOne({_id:id});
  user.name = req.body.name;
  user.lastname = req.body.lastname;
  user.mode = req.body.mode;
  await user.save();
  res.redirect('/');
})

// DELETE USER
router.get('/delete/:id', async (req, res) => {
  var {id} = req.params;
  await User.deleteOne({_id:id});
  res.redirect('/login');
})

module.exports = router;
