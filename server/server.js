// username : tech-edu
// password : hrCquBSSUeUZKW7F
const express = require('express');
const app = express();
const dotenv=require('dotenv');
dotenv.config({path:'./.env'});
const cors = require('cors');
app.use('/Images',express.static('./Images'))

app.use(cors())
app.use(express.urlencoded({ extended: false }));


require('./db/connection');
const port = process.env.PORT;

app.use(express.json());
app.use(require('./router/auth'));

app.get("/",(req,res)=>{
    res.send("Server Running on Home Page")
})

  
  // Get Blog data 

app.listen(port,()=>{
    console.log(`Server is Running on the Server No ${port}`)
})