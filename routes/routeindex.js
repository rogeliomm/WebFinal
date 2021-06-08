const { render } = require('ejs');
const express = require('express');
const router = express.Router();
//const Post = require('../model/post');
const User = require('../model/user');
const jwt = require("jsonwebtoken");
const verify = require("../middleware/verifyAccess");
var secret = process.env.LLAVE_SECRETA || "";

var translation = "";

router.get('/',verify ,async function(req,res){
  //console.log("User id: " + req.userId);
  //var posts = await Post.find();
  //console.log(posts);
  var email = req.userId;
  var user = await User.findOne({email:email});
  //console.log(userId);
  console.log(user);
  var name = user.name;
  var lastname = user.lastname;
  var id = user._id;
  var mode = user.mode;
  res.render('index',{title: 'home', translation, name, lastname, id, mode});
});

/*
router.get('/newPost',verify, async (req,res) =>{
  res.render('newPost',{ title: 'newPost', author:req.userId});
});




router.post('/newPost',verify, async (req,res) =>{
 
  console.log(req.body);
  var post = new Post(req.body);
  await post.save();
  res.redirect("/");

});


router.get('/edit/:id',verify, async (req,res) =>{
 
var {id} = req.params;
var post = await Post.findById(id);
res.render('edit',{post, title: 'edit'})
 
 });


 router.post('/edit/:id',verify, async (req,res) =>{
 
  var {id} = req.params;
  await Post.update({_id:id}, req.body);
  res.redirect("/");

});

router.get('/delete/:id',verify, async (req,res) =>{
 
  var {id} = req.params;
  var post = await Post.findById(id);
  res.render('delete',{post,title: 'delete'})
   
});

router.post('/delete/:id',verify, async (req,res) =>{
 
  var {id} = req.params;
  await Post.deleteOne({_id:id})
  res.redirect("/");

});
*/
// TRANSLATE
router.post('/translate', async (req,res) =>{
  // Translate logic
  /*
  console.log("translating");
  let translation = req.body.text; // -------- Do translation here -------- //
  //console.log(req.body);
  var userId = req.userId;

  console.log(req);
  //console.log(user);

  var user = await User.findOne({email:userId});
  
  var name = user.name;
  var lastname = user.lastname;
  res.render('index',{title: 'home', translation, name, lastname});
  */

  translation = req.body.text; // -------- Do translation here -------- //

  res.redirect('/');
})


// LOG IN 
router.get('/login', async (req,res) => {
  translation = "";
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
  res.redirect('/');
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