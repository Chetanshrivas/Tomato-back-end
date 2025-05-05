import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

// login user       --------------------------------------------------------------------------------------------------------------
const loginUser = async (req , res)=>{
    const {email , password} = req.body;
    try {

        const user = await userModel.findOne({email});
        //agr eamil nhi to ye response dedo
        if(!user){
            return res.json({success:false ,  message : "User not found"})
        }

        // or agr eamil hai to bhai passwoerd ko bycrypt kro vapis match krne ke liye
        const isMatch =  await bcrypt.compare(password , user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // agr match ho gaya to token ko generate karo
        const token = createToken(user._id) ;
        res.json({success : true , message : "User logged in successfully" , token});
    } 

    catch (error) {
        console.log(error) ;
        return res.json({ success: false, message: "Error" });   
    }
}

// creating token  ---------------------------------------------------------------------------------------------------------------
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// register user   ---------------------------------------------------------------------------------------------------------------
const registerUser = async (req , res)=>{
    const {name , email , password} = req.body ;
    try {
        // checking if user already exist with that email
        const exists = await userModel.findOne({email});
        if(exists) {
            return res.json({ success : false , message: 'Email already exists' });
        }

        // validating email and strong pass
        if( !validator.isEmail(email)) {
            return res.json({ success : false , message: 'Please enter a valid email' });
        }

        if( password.length < 8){
            return res.json({ success: false, message: 'Password must be at least 8 characters long' });    
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // creating new user
        const newUser = new userModel ({
            name : name ,
            email: email,
            password: hashedPassword
        })
        const user = await newUser.save();
        const token = createToken(user._id) ;// yaha hamne token bana diya 
        res.json({ success : true , token });
    } 

    catch (error) {
        console.log(error);
        res.json({ success : false , message: 'Error occurred' });
    
    }
}

export {loginUser , registerUser} ;