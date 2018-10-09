const router = require('express').Router();
const vendor = require('../database-connection').vendor;
const product = require('../database-connection').product;
const passport = require('passport');
const jwt = require('passport-jwt');
require('../passport-setup')(passport);
const getToken = require('../utilities/getToken');
const sequelize = require('../database-connection').sequelize;

router.get('/all',(req,res)=>{
    passport.authenticate('jwt', {session: false},async (err, user, info) => {
        let token = getToken(req.headers);
    if(token){
        const products = await product.findAll({
            include:[{
                model: vendor
            }]
        });
        res.send({success:true, products: products});
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
        const products = await product.findAll({
            where:{
                productName:req.params.name
            }
        });
        res.send({success:true, products: products});
    }else{
        res.send({success: false, message: 'Unauthorized'});
    }
    })(req, res);
})

router.post('/add',(req,res)=>{
    passport.authenticate('jwt', {session: false},async (err,user,info)=>{
        let token = getToken(req.headers);
        if(token){

            const productName = req.body.productName;
            const vendorId = req.body.vendorId;

            const newProduct = await product.create({
                productName: productName,
                fk_vendorId: vendorId
            }).catch((err)=>{
                res.send({success: false, message: err});
            });

            newProduct.save();

            res.send({success:true, message: "Vendor Added"});
        }else{
            res.send({success: false, message: 'Unauthorized'});
        }
    })(req,res);
})

module.exports = router;