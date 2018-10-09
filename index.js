const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database-connection').sequelize;
const vendor = require('./database-connection').vendor;
const userRouter = require('./routes/user');
const vendorRouter = require('./routes/vendor');
const productRouter = require('./routes/product');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/user', userRouter);
app.use('/vendor', vendorRouter);
app.use('/product', productRouter);


db.sync()
.then(()=>{
    console.log("Success")
}).catch((err)=>{
    console.log(`${err}`)
})

app.listen(PORT,()=>{
    console.log(`Listening on port : ${PORT}`);
})