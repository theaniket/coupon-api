const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database-connection').sequelize;

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

db.sync()
.then(()=>{
    console.log("Success")
}).catch((err)=>{
    console.log(`${err}`)
})

app.listen(PORT,()=>{
    console.log(`Listening on port : ${PORT}`);
})