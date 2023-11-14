const express = require('express');
const router  = express.Router();
const User = require('../models/schemas');
const bcrypt = require('bcrypt');
const dotenv=require('dotenv');
dotenv.config({path:'./.env'});
const jwt = require('jsonwebtoken')


const SECRET_KEY = process.env.SECRET_KEY;

// Post Register form data from register page
router.post('/register', async(req,res)=>{
  try{
    const {username,email,password,cpassword} = req.body;
    const userExist = await User.findOne({email : email})
    const hashPassword = await bcrypt.hash(password,10);
    const hashCpassword = await bcrypt.hash(cpassword,10)
  
    if (!username || !email || !password || !cpassword) {
      return res.status(422).json({error:"Please Fill all Fields Correctly"});
    }
    else if (userExist) {
        return res.status(422).json({error:"Email is Already Exist"})
    }
    else if( password != cpassword){
        return res.status(422).json({error:"Password not Match"})
    }
    else{
      const existingUsers = await User.find();
      const role = existingUsers.length === 0 ? 'admin' : 'user';
     const users = new User({username,email,password: hashPassword, cpassword:hashCpassword ,role});
     await users.save();
     res.status(200).json({massage:"User Registered Successfully"});
    }
  }catch(err){
    console.log('Unable to Register');
  }
})

// Post Register form data from home page
router.post('/', async(req,res)=>{
  try{
    const {username,email,password,cpassword} = req.body;
    const userExist = await User.findOne({email : email})
    const hashPassword = await bcrypt.hash(password,10);
    const hashCpassword = await bcrypt.hash(cpassword,10)
    if (!username || !email || !password || !cpassword) {
      return res.status(422).json({error:"Please Fill all Fields Correctly"});
    }
    else if (userExist) {
        return res.status(422).json({error:"Email is Already Exist"})
    }
    else if( password != cpassword){
        return res.status(422).json({error:"Password not Match"})
    }
    else{
      const existingUsers = await User.find();
      const role = existingUsers.length === 0 ? 'admin' : 'user';
     const users = new User({username,email,password: hashPassword, cpassword:hashCpassword ,role});
     await users.save();
     res.status(200).json({massage:"User Registered Successfully"});
    }
  }catch(err){
    console.log('Unable to Register');
  }
})

// Post Login form data from Login page
router.post('/login', async(req,res)=>{
  try{
  const {email,password} = req.body;
  const user = await User.findOne({email:email});
  if (!user) {
    return res.status(401).json({error : "Invalid Credentials"});
  }
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).json({error : "Invalid Credentials"});
  }

    const token = jwt.sign({userId : user._id, role: user.role},SECRET_KEY,{expiresIn:'365d'})  
   res.json({massage:"login Successfully"});

  }catch(err){
    console.log('Error Logging in',err);
  }
})

// Post Blog data 

const multer  = require('multer');
const Blogs = require('../models/blogschemas');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() 
    cb(null, uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage })

router.post('/postblog', upload.single('file'), async(req,res)=>{
const title = req.body.title;
const des = req.body.des;
const fulldes = req.body.fulldes;
const file = req.file.filename;

if (!title || !des || !fulldes || !file) {
  return res.status(422).json({error:"Please Fill all Fields Correctly"});
}
else{
  try{
    const blogs = new Blogs({title:title,des:des,fulldes:fulldes,file:file});
    await blogs.save();
    res.json({status : 'ok'})
  }catch(error){
    res.json({status : error})
  }
}



})

// Get Blog data on All Blogs table
router.get('/allblogs',async(req,res)=>{
  try{
   Blogs.find({}).then((data)=>{
    res.send({status: "ok" , data:data});
   });
  }
  catch(error){
    console.log(error);
  }
})

// Get Blog data on All Blogs table
router.get('/updateblog/:id',async(req,res)=>{
  try{
    const id = req.params.id
   Blogs.findById({_id:id}).then((data)=>{
    res.send({status: "ok"});
   });
  }
  catch(error){
    console.log(error);
  }
})

// Delete Blog data on All Blogs table
router.delete('/allblogs/:id',async(req,res)=>{
const id = req.params.id
 await Blogs.deleteOne({_id: id}).then(()=>{
  res.send({success :true,massage:"Data Deleted Successfully"})
})

})

// Update Blog data on All Blogs table
router.put('/updateblog',async (req,res)=>{
const{id,...rest}=req.body
const data = await Blogs.updateOne({_id:id},rest)
res.send({success :true ,massage:"Data Updated Successfully",data:data})
})



module.exports = router;