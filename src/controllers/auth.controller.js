const usermodel=require("../models/user.model");
const bcrypt =require("bcryptjs")
const jwt =require("jsonwebtoken");

async function registercontroller(req,res){
    const {email,username,password} =req.body;

    const isalreadyexist =await usermodel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(isalreadyexist){
        return res.status(409).json({
            message:"user already exist "+isalreadyexist.email==email ?"email is already register " :"username is already register"

        })
    }

    const hash =await bcrypt.hash(password,10);

    const user =await usermodel.create({
        username,
        email,
        password:hash
    })

    const token =jwt.sign({
            id:user._id,
            username:user.username

        },process.env.JWT_Secret,{expiresIn:"1d"})
    

    res.cookie("token",token);

    return res.status(200).json({
        message:"user register successfully",
        user:{
            username:user.username,
            email:user,email
        }
    })
}

async function logincontroller(req,res) {
    const {username ,email ,password} =req.body;

    const user=await usermodel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }

    const ispassword =await bcrypt.compare(password,user.password);

    if(!ispassword){
        return res.status(401).json({
            message:"password is wrong"
        })
    }

    const token =jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_Secret,
        {expiresIn:"1d"}

    )

    res.cookie("token",token);

    return res.status(200).json({
        message:"user logged in successfully",
        user:{
            username:user.username,
            email:user.email,
        }
    })
}

const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user.model");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleLogin (req, res)  {
  try {
    const { idToken } = req.body;

    // 1️⃣ Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture, sub } = payload;

    // 2️⃣ Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // 3️⃣ Create new user
      user = await User.create({
        name,
        email,
        googleId: sub,
        avatar: picture,
      });
    }

    // 4️⃣ Create your own JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Google login successful",
      token,
      user,
    });

  } catch (error) {
    res.status(400).json({
      message: "Google login failed",
      error: error.message,
    });
  }
};
module.exports={
    registercontroller,
    logincontroller,
    googleLogin
}