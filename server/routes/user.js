import express from 'express';
import { checkEmpty, hashPassword } from '../functions/functions';
import userModel from '../models/user';
import { genSalt, hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { userJwtSecret } from '../config/key';
import { checkUserAuthenication } from '../middleware/middleware';

const routes = express.Router();

const userRouter = ()=>{
    routes.post('/signup',async(req,res)=>{
        const body = req.body;
        const checkValidation = checkEmpty(body);
        const {isValid,errors} = checkValidation;
    
        try{
            // console.log(checkValidation,body);
            if(isValid){
                const isUserExist = await userModel.findOne({email:{
                    $regex:`^${body.email}$`,
                    $options:'i'
                }});
                if(!isUserExist){
                    const salt = await genSalt(10);
                    const hashpassword = await hash(body.password,salt);
                    // console.log(hashpassword);
                    // const hashPass = await hashPassword(body.password);
                    // console.log(hashPassword)
                    // req.body.password = hashPass;
                    req.body.password = hashpassword;
                    const userData = new userModel(req.body);
                    const saveData = await userData.save();
                    if(saveData){
                        res.send({
                            code:200,
                            msg:"User is successfully Registered"
                        })
                    }                    
                }else{
                    res.send({
                        code:400,
                        msg:"User is already present"
                    })
                }

            }else{
                res.send({
                    code:400,
                    msg: "Some fields are empty",
                    errors:errors
                })
            }

        }catch(err){
            console.log(`user routes get err ${err}`);
        }
    });

    routes.post('/login',async(req,res)=>{
        const body = req.body;
        try{
            const vaildationCheck = checkEmpty(body);
            const {isValid,errors} = vaildationCheck;
            if(isValid){
                const isUserExist = await userModel.findOne({
                    email:{
                        $regex:`^${body.email}$`,
                        $options:'i'
                    }
                })
                if(isUserExist ){
                    const checkPassword = await compare(body.password,isUserExist.password);
                    if(checkPassword){
                        const payload = {
                            userid:isUserExist.id
                        }
                        const token = await sign(payload,userJwtSecret,{
                            expiresIn:'2h'
                        });
                        res.send({
                            code:200,
                            msg:"Authenticated",
                            token:token,
                            id:payload.userid
                        })

                    }else{
                        res.send({
                            code:400,
                            msg:"Password is not correct"
                        })
                    }
                }else{
                    res.send({
                        code:400,
                        msg:"User not found "
                    })
                }
            }
            else{
                res.send({
                    code:400,
                    msg:'some fields are empty',
                    errors:errors
                })
            }
        }catch(err){
            console.log(`error found in login routes ${err}`);
        }
    })
    routes.get('/getProfile',checkUserAuthenication,async(req,res)=>{
        try{
            const userid = req.headers.tokenData.userid || req.body.userid;
            const profileData= await userModel.findById({
                _id:userid
            }).select('-password');
            if(profileData){
                res.send({
                    code:200,
                    profileData:profileData
                })
            }
        }catch(error){
            console.log(`some error are found ${error}`)
            res.send({
                code:400,
                msg:'some error are found '
            })
        }
    });
    routes.put('/updateProfile',checkUserAuthenication,async(req,res)=>{
        const userid = req.headers.tokenData.userid;
        try {
            const body = req.body;
            const updateData = await userModel.updateOne({
                _id:userid
            },body);
            // console.log(updateData,body)
            if(updateData.nModified==1){
                res.send({
                    code:200,
                    msg:"Profile is updated"
                })
            }else{
                res.send({
                    code:400,
                    msg:"Some error found in updation"
                })
            }
        } catch (err) {
            console.log(`updateProfile has got error ${err}`);
            res.send({
                code:400,
                msg:"some error has occured"
            })
        }
    })
    
    return routes;
}

module.exports=userRouter;