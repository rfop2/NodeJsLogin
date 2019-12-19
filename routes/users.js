const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

//User model
const User = require('../models/User');

//Login Page
router.get('/login', (req,res) => res.render('login'));

//Register Page
router.get('/register', (req,res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
   const{name,email,password, password2} = req.body;
   let erros = [];

   //Check require fields
   if(!name || !email || !password || !password2){
       erros.push({msg: 'Por favor preencha todos os campos'});
   }


   //Check password matchs
   if(password !== password2){
       erros.push({msg: 'Passwords nao sao iguais'})
   }

   // Check pass length
   if(password.length < 6){
       erros.push({msg: 'Password deve ter no minimo 6 caracteres'});
   }
   if(erros.length > 0 ){
      res.render('register', {
          erros,
          name,
          email,
          password,
          password2
      })
   } else {
      // Validation passed
      User.findOne({email:email})
        .then(user => {
            if(user){
                // User exists
                erros.push({msg: 'Email is already registered'});
                res.render('register', {
                    erros,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash password
                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt , (err,hash) =>{
                    if(err) throw err;
                    // Set password to hashed
                    newUser.password = hash;
                    // Save user
                    newUser.save() // save no mongoDB
                    .then(user =>{
                        req.flash('sucess_msg' ,'You are now registred and can log in');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));

                }))
            }
        });
   }
});


module.exports = router;