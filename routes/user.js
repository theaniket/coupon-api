const router = require('express').Router();
const user = require('../database-connection').user;
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const secret = require('../configs/jwt-config').secret;
const passwordHash = require('password-hash');

router.post('/signup',async (req,res)=>{
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const admin = req.body.admin;
    const isVerified = req.body.isVerified;

    if(!phoneNumber|| !password){
        res.send({
            success: false,
            message: "fields can't be empty" 
        })
    }

    else{
        const isUser = await user.findOne({
            where:{
                phoneNumber: phoneNumber
            }
        })

        console.log(user);

        if(isUser){
            res.send({success: false, message: "Phone Number already exists"});
        }else{
            const newUser = await user.build({
                phoneNumber: phoneNumber,
                password: password,
                isVerified: isVerified,
                admin: admin
            }).save();
            newUser.save();
            res.send({
                success: true,
                message: 'Please Log In!'
            })
        }
        
    }
})

router.post('/signin', async (req,res)=>{
    const phoneNumber = req.body.phoneNumber;
    const x = await user.findOne({
        where:{
            phoneNumber: phoneNumber
        }
    }).then((user)=>{
        const password = req.body.password;
        if(user.password == password){
            let token = jwt.sign(user.toJSON(),secret,{expiresIn: '30m'});
            if(user.isVerified){
                res.json({success: true, token: 'JWT ' + token});
            }else{
                res.json({success: false, message: "Please! Verify phonenumber."})
            }
            
        }
        else{
            res.json({success: false, messagee: 'Invalid Password'});
        }
    }).catch((err)=>{
        console.log(err);
        res.send({success: false, message: err});
    })
})

module.exports = router;