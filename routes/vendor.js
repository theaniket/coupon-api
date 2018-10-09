const router = require('express').Router();
const vendor = require('../database-connection').vendor;
const passport = require('passport');
const jwt = require('passport-jwt');
require('../passport-setup')(passport);
const getToken = require('../utilities/getToken');
const sequelize = require('../database-connection').sequelize;

router.get('/all',(req,res)=>{
    passport.authenticate('jwt', {session: false},async (err, user, info) => {
        let token = getToken(req.headers);
    if(token){
        const vendors = await vendor.findAll();
        res.send({success:true, vendors: vendors});
    }else{
        res.send({success: false, message: 'Unauthorized'});
    }
    })(req, res);
})

router.get('/byname/:name',(req,res)=>{
    passport.authenticate('jwt', {session: false},async (err, user, info) => {
        const name = req.params.name;
        let token = getToken(req.headers);
    if(token){
        const vendors = await vendor.findAll({
            where:{
                vendorName: name
            }
        });
        res.send({success:true, vendors: vendors});
    }else{
        res.send({success: false, message: 'Unauthorized'});
    }
    })(req, res);
})

router.post('/add',(req,res)=>{
    passport.authenticate('jwt', {session: false},async (err,user,info)=>{
        const vendorName = req.body.vendorName;
        let token = getToken(req.headers);
        if(token){

            const newVendor = await vendor.create({
                vendorName: vendorName
            }).catch((err)=>{
                res.send({success: false, message: err});
            });

            newVendor.save();

            res.send({success:true, message: "Vendor Added"});
        }else{
            res.send({success: false, message: 'Unauthorized'});
        }
    })(req,res);
})

module.exports = router;