const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    des:{
     type:String,
     required:true
    },
    fulldes:{
     type:String,
     required:true
    },
    file:{
        type:String,
        required:true
    },
});

const Blogs = mongoose.model("blog",blogSchema);

module.exports=Blogs;