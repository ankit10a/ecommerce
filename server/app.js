import express from "express";
import http from 'http';
import cors from 'cors';
import { mongoConnect } from "./config/mongo";
import { PORT } from "./config/key";

const app = express();
const server = http.createServer(app);
mongoConnect();

app.use(express.json());

const userRouter = require('./routes/user')();
const orderRouter = require('./routes/order')();

app.use('/user',[userRouter,orderRouter]);


server.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`);
})