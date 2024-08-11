import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const register = async(req,res,next) =>{
    try{
    const {username,email,password} = req.body;
    const usernameCheck = await User.findOne({username});
    if(usernameCheck)
    return res.json({msg:"Username already exists",status:false});
    const emailCheck = await User.findOne({email});
    if(emailCheck)
    return res.json({msg:"Email already exists",status:false});
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        username,email,password:hashedPassword
    });
    const userResponse = user.toObject();
    delete userResponse.password;
    return res.json({ status: true, user: userResponse });
  } catch (exp) {
    next(exp);
  }
};

export const login = async(req,res,next) =>{
  try{
  const {username,password} = req.body;
  const user = await User.findOne({username});
  if(!user)
  return res.json({msg:"Incorrect Username or Password",status:false});
  const passwordCheck = await bcrypt.compare(password,user.password);
  if(!passwordCheck)
    return res.json({msg:"Incorrect Username or Password",status:false});
  
  delete user.password;
  return res.json({status:true,user})
  }catch(exp){
    next(exp)
  }
};

export const setAvatar = async(req,res,next) =>{
  try{
    const userId = req.params.id;
    const avatarImg = req.body.image;
    const userData = await User.findByIdAndUpdate(userId,{
      isAvatarImgSet: true,
      avatarImg,
    });
      return res.json({isSet:userData.isAvatarImgSet,image:userData.avatarImg})
  }catch(ex){
    next(ex)
  }
};

export const getAllUsers = async(req,res,next) =>{
  try{
    const userId = req.params.id;
    
    const users = await User.find({_id:{$ne:userId}}).select([
      "email",
      "username",
      "avatarImg",
      "_id",
    ]);
    
    return res.json(users);
    }catch(ex){
      
    next(ex)
  }
};

