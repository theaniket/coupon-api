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

    const hashedPassword = passwordHash.generate(password);

    if(!phoneNumber|| !password){
        res.send({
            success: false,
            message: "fields can't be empty" 
        })
    }

    else{
        const newUser = await user.build({
            phoneNumber: phoneNumber,
            password: hashedPassword,
            isVerified: isVerified,
            admin: admin
        }).save();
        console.log(newUser.dataValues.userId);
        res.send({
            success: true,
            message: 'Please Log In!'
        })
    }
})

router.post('/signin', async (req,res)=>{
    const phonenumber = req.body.phonenumber;
    const x = await user.findOne({
        where:{
            phoneNumber: phonenumber
        }
    }).then((user)=>{
        const password = req.body.password;
        const hashedPassword = passwordHash.generate(password);
        if(user.password == hashedPassword){
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
        res.send({success: false, message: 'Inavlid Credentials'});
    })
})

module.exports = router;