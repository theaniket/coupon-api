const router = require('express').Router();
const user = require('../database-connection').user;
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const secret = require('../configs/jwt-config').secret;

router.post('/signup',async (req,res)=>{
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;

    if(!phoneNumber|| !password){
        res.send({
            success: false,
            message: "fields can't be empty" 
        })
    }

    else{
        const newUser = await user.build({
            phoneNumber: phoneNumber,
            password: password,
            isVerified: true
        }).save();
        console.log(newUser.dataValues.userId);
        res.send({
            success: true,
            message: 'Please Log In!'
        })
    }
})

router.post('/signin', async (req,res)=>{
    const x = await user.findOne({
        where:{
            phoneNumber: req.body.phoneNumber
        }
    }).then((user)=>{
        if(user.password == req.body.password){
            let token = jwt.sign(user.toJSON(),secret,{expiresIn: '30m'});
            res.json({success: true, token: 'JWT ' + token});
        }
        else{
            res.json({success: false, messagee: 'Invalid Password'});
        }
    }).catch((err)=>{
        res.send({success: false, message: 'Inavlid Credentials'});
    })
})

module.exports = router;