var express = require('express');
var router = express.Router();
const passport = require('passport')
let DB = require('../config/db')
let userModel = require('../model/User')
let User = userModel.User;

/* GET home page. */
router.get('/', function(req,res,next){
  if(!req.user)
  {
    res.render('auth/login',{
      title:'Login',
      message:req.flash('loginMessage'),
      displayName:req.user ? req.user.displayName:''
    })
  }
  else {
    return res.redirect('/home');
  }
})

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home' }); // Change 'index' to name of ejs applied
});

/* GET profile page. */
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Profile' });
});
// get and post router of login.ejs
router.get('/login', function(req,res,next){
  if(!req.user)
  {
    res.render('auth/login',{
      title:'Login',
      message:req.flash('loginMessage'),
      displayName:req.user ? req.user.displayName:''
    })
  }
  else {
    return res.redirect('/home');
  }
})
router.post('/login',function(req,res,next){
  passport.authenticate('local',(err,user,info)=>{
    if(err)
    {
      return next(err);
    }
    if(!user)
    {
      req.flash('loginMessage','AuthenticationError');
      return res.redirect('/login')
    }
    req.login(user,(err)=>{
      if(err)
      {
        return next(err)
      }
      return res.redirect('/home')
    })
  })(req,res,next)
})
// get and post router of register.ejs
router.get('/register',function(req,res,next){
  if(!req.user)
  {
    res.render('auth/register',{
      title:'Register',
      message:req.flash('registerMessage'),
      displayName:req.user ? req.user.displayName:''
    })
  }
  else
  {
    return res.redirect('/login')
  }
})
router.post('/register',function(req,res,next){
  let newUser = new User({
    username: req.body.username,
    //password: req.body.password,
    email: req.body.email,
    displayName: req.body.displayName
  })
  User.register(newUser, req.body.password,(err)=>{
    if(err){
      console.log("Error: Inserting the new user");
      if(err.name=="UserExistsError")
      {
        req.flash('registerMessage','Registration Error: User already exists');
      }
      return res.render('auth/register',
      {
        title:'Register',
        message:req.flash('registerMessage'),
        displayName:req.user ? req.user.displayName:''
      })
    }
    else{
      return passport.authenticate('local')(req,res,()=>{
        res.redirect('home')
      })
    }
  })
})
router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err)
    {
      return next(err)
    }
  })
  req.redirect('/home')
})
module.exports = router;
