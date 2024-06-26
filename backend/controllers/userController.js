const User = require("../model/userModel");
const ErrorHander = require("../utils/errorHander")
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");



exports.registerUser = catchAsyncErrors( async(req, res, next)=>{
    const {name, email, password} = req.body

    const user = await User.create({
        name, email, password, avatar:{
            public_id: "This is a sample id",
            url : "profilepicURL"
        }
    })
    sendToken(user,200,res);
})


exports.loginUser = catchAsyncErrors(async (req,res,next)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return next(ErrorHander("Please Enter valid & Password",400))
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHander("Invalid email or password"));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid Email or Password",401));
    }
    sendToken(user,200,res);

})