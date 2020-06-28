import { verify } from "jsonwebtoken";
import { userJwtSecret } from "../config/key";
import { genSalt, hash } from "bcryptjs";

export const checkEmpty = (obj)=>{
    const err =[];
    for(let key in obj){
        if(!obj[key]){
            err.push({[key]:obj[key]})
        }
    }
    return{isValid:err.length>0?false:true,errors:err}
}

export const hashPassword =(password)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const salt = await genSalt(10);
            const encodedPass = await hash(password,salt);
            resolve(encodedPass);
        }catch(er){
            console.log(er);
            reject(false)
        }
    })
}

export const verifyToken=(token)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const isTokenValid = await verify(token,userJwtSecret);
            if(isTokenValid){
                resolve(isTokenValid);
            }else{
                reject(false)
            }
        }catch(e){
            reject(false)
        }
    })
}