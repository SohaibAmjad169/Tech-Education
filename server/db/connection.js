const mongoose = require('mongoose');

const url = process.env.URL

mongoose.connect(url).then(()=>{
    console.log('Connection Successful');
}).catch((err)=>{
    console.log(err);
})