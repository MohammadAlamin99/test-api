
const sendgmaill = require("../Utility/sendgmaill");
const OTPModel = require("../models/OTPModel");
const UsersModel = require("../models/UsersModel");
const jwt = require("jsonwebtoken")

// Registration

exports.UserRegistration = async (req) => {
    try {
        let reqBody = req.body;
        await UsersModel.create(reqBody);
        return {status:"success", message:"regestaration successfully"}
    } catch (e) {
        return {status:"fail", message:e}
    }
}


// User LogIn
exports.UserLogin = async (req)=>{
    try {
        let reqBody = req.body;
        let data = await UsersModel.aggregate([
            {$match:reqBody},
            {$project:{"_id":0,"password":0,"createdDate":0 }}
        ])
        // data output:{
//     email: 'alamin.cse.99@gmail.com',
//     firstName: 'alamin mohlla',
//     lastName: 'miya',
//     mobile: '017XXXXXXXXXXX',
//     password: '1234',
//     photo: 'nai'
//   }
        if(data.length>0){
           let payload = {exp: Math.floor(Date.now() / 1000) + (24*60*60),data:data[0]['email']};  //token create process
           let token = jwt.sign(payload, 'bcd123');
           return({status:"success",token:token, data:data[0]})
        }
        else{
            return {status:"fail", message:"something went wrong"}
        }

    } catch (e) {
        console.log(e)
        return {status:"fail", message:"something went wrong"}
    }
}

// Profile update
exports.UpadateProfile = async (req, res)=>{
    try {
        let email = req.headers['email'];
        let reqBody = req.body;
        let data = await UsersModel.updateOne({email:email},reqBody);
        return({status:"success", data:data});

    } catch (e) {
        console.log(e)
        return {status:"fail", message:"something went wrong"}
    }
}


// Profile Details 
exports.UserProfileDetails = async (req)=>{
    try {
        let email = req.headers['email'];
        let data = await UsersModel.aggregate([
            {$match:{email:email}},
            {$project:{_id:1,email:1,firstName:1,lastName:1,mobile:1,photo:1,password:1}}
        ])
        return({status:"success", data:data});

    } catch (e) {
        return {status:"fail", message:"something went wrong"}
    }
}

// Recovery email 

exports.RecoveryEmailVerify = async (req)=>{
    try {
        let email = req.params.email;
        let otpCode = Math.floor(100000 + Math.random() * 900000);

        let UserCount = await UsersModel.aggregate([
           {$match:{email:email}}, {$count:"total"}
        ])
            if(UserCount.length>0){
                let setOtp = await OTPModel.create({email:email, otp:otpCode});
                let sendEmail = await sendgmaill(email, "Your PIN Code is= "+otpCode,"Task Manager PIN Verification" );
                return({status: "success", data: "Your otp code has been success"})
            }
            else{
                return({status: "success", data: "you have no user"})
            }
    } catch (e) {
        console.log(e)
        return {status:"fail", message:"something went wrong"}
    }
}

exports.RecoveryVerifyOTP = async(req)=>{
    try {
        let email = req.params.email;
        let otpCode = req.params.otp;
        let status=0;
        let statusUpdate=1;

        let OtpCount = await OTPModel.aggregate([
            {$match:{email:email,otp:otpCode, status:status}}, {$count:"total"}
         ])

            if(OtpCount.length>0){
                let setOtp = await OTPModel.updateOne({email:email,otp:otpCode, status:status},{email:email,otp:otpCode, status:statusUpdate})
                return({status: "success", data: "verification success"})
            }

            else{
                return({status: "fail", data: "Invalid otp code"})
            }

        
    } catch (e) {
        return {status:"fail", message:"something went wrong"}
    }
}



exports.RecoveryNewPassword = async(req)=>{
    try {
        let email = req.body['email'];
        let otpCode = req.body['otp'];
        let newPass = req.body['password'];
       
        let statusUpdate=1;

        let count = await OTPModel.aggregate([
            {$match:{email:email,otp:otpCode, status:statusUpdate}}, {$count:"total"}
         ])

            if(count.length>0){
                let passUpdate = await UsersModel.updateOne({email:email},{ password: newPass})
                return({status: "success", data: "Change the password"})
            }

            else{
                return({status: "fail", data: "Invalid Request"})
            }

    } catch (e) {
        return {status:"fail", message:"something went wrong"}
    }
}




