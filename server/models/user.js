import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    dob:{
        type:Date
    },
    password:{
        type:String,
        required:true
    },
    country:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    gender:{
        type:String
    },
    profilePic:{
        type:String,
        default:"../public/images/profile/default.png"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

const userModel = mongoose.model('user',userSchema);

export default userModel;