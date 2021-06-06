const { render } = require('ejs');
const express = require('express');
const router = express.Router();
//const Post = require('../model/post');
const User = require('../model/user');
const jwt = require("jsonwebtoken");
const verify = require("../middleware/verifyAccess");
var secret = process.env.LLAVE_SECRETA || "";


router.get('/',verify ,async function(req,res){
  //console.log("User id: " + req.userId);
  //var posts = await Post.find();
  //console.log(posts);
  let translation = ""
  res.render('index',{title: 'home', translation});
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
  console.log("translating");
  let translation = req.body.text; // -------- Do translation here -------- //
  //console.log(req.body);
  res.render('index',{title: 'home', translation});
})


// LOG IN 
router.get('/login', async (req,res) => {
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
      res.cookie("token", token, {httpOnly:true,maxAge: 60000 })
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
  
  await user.save();

  res.redirect('/');
} )


module.exports = router;