import { verifyToken } from "../functions/functions";

export const checkUserAuthenication =async(req,res,next)=>{
    const token = req.headers['x-custom-header'] ;
    try{
        const isTokenValid = await verifyToken(token);
        if(isTokenValid){
            req.headers.tokenData= isTokenValid;
            next();
        }else{
            res.send({
                code:400,
                msg:'Authentication is required'
            })
        }

    }catch(err){
        console.log(`middlleware got error ${err}`);
        res.send({
            code:400,
            msg:'Session is Expired Authentication required '
        })
    }
}