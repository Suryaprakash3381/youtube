// src/db/connection.js
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async function main() {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       
}

export default connectDB;

