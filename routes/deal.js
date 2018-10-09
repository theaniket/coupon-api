const router = require('express').Router();
const deal = require('../database-connection').deal;
const product = require('../database-connection').product;
const passport = require('passport');
require('../passport-setup')(passport);
const getToken = require('../utilities/getToken');

router.get('/all',(req,res)=>{
    passport.authenticate('jwt', {session: false},async (err, user, info) => {
        let token = getToken(req.headers);
    if(token){
        const deals = await deal.findAll({
            include:[{
                model: product
            }]
        });
        res.send({success:true, deals: deals});
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
        const deals = await deal.findAll({
            where:{
                productName: name
            }
        });
        res.send({success:true, deals: deals});
    }else{
        res.send({success: false, message: 'Unauthorized'});
    }
    })(req, res);
})

router.post('/add',(req,res)=>{
    passport.authenticate('jwt', {session: false},async (err,user,info)=>{
        let token = getToken(req.headers);
        if(token){

            const hotDeal = req.body.hotDeal;
            const discountPercent = req.body.discountPercent;
            const buyOneGetOne = req.body.buyOneGetOne;
            const expiresOn = req.body.expiresOn;
            const productId = req.body.productId;

            const newDeal = await deal.create({
                hotDeal: hotDeal,
                discountPercent: discountPercent,
                buyOneGetOne: buyOneGetOne,
                expiresOn: expiresOn,
                fk_productId: productId
            }).catch((err)=>{
                res.send({success: false, message: err});
            });

            newDeal.save();

            res.send({success:true, message: "Vendor Added"});
        }else{
            res.send({success: false, message: 'Unauthorized'});
        }
    })(req,res);
})

module.exports = router;