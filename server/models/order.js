import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userid:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    cod:{
        type:Boolean,
        default:true
    },
    isPayed:{
        type:Boolean,
        default:false
    },
    address:{
        type:String,
        required:true
    },
    items:[
        {
            qty:{
                type:Number,
                default:1
            },
            description:{
                type:String
            },
            name:{
                type:String
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const orderModel = mongoose.model("order",orderSchema);

export default orderModel;