import express from 'express';
import { model } from 'mongoose';
import { checkUserAuthenication } from '../middleware/middleware';
import orderModel from '../models/order';

const routes = express.Router();

const orderRouter =()=>{

    routes.post('/placedOrder',checkUserAuthenication,async(req,res)=>{
        const userid = req.headers.tokenData.userid;
        try{
            const body = req.body;
            req.body.userid = userid;
            const orderData = new orderModel(req.body);
            const saveData = await orderData.save();
            if(saveData){
                res.send({
                    code:200,
                    msg:"OrderPlaced Successfully"
                })
            }
            else{   
                res.send({
                    code:400,
                    msg:"Some error has occured"
                })
            }
        }catch(err){
            console.log(`placed order got err ${err}`);
            res.send({
                code:400,
                msg:"Some error has Occured"
            })
        }

    })

    routes.get('/getOrder',checkUserAuthenication,async(req,res)=>{
        const userid = req.headers.tokenData.userid;
        try {
            const orders = await orderModel.find({
                userid
            }).select('-userid');
            if(orders){
                res.send({
                    code:200,
                    orders:orders
                })
            }
        } catch (err) {
            console.log(`get order got error ${err}`);
            res.send({
                code:400,
                msg:"Some error has occured"
            })
        }
    })

    return routes;
}

module.exports = orderRouter;