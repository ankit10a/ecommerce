import mongoose from 'mongoose';
import { mongoURL } from './key';

export const mongoConnect = async()=>{
    try{
   await mongoose.set('useCreateIndex',true);
   await mongoose.connect(mongoURL,
        {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("mongo is connected now");
    }catch(err){
        console.log('mongo connect got error',err)
    }
}