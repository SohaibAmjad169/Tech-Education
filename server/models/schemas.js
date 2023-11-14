const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
     type:String,
     required:true
    },
    password:{
     type:String,
     required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
      }
});

const User = mongoose.model("user-register",userSchema);

module.exports=User;