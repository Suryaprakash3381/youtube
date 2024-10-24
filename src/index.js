// src/index.js
import dotenv from "dotenv";
import connectDB from "./db/connection.js";
import { app } from "./app.js";

dotenv.config({ path: './env' });

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
        console.log(`DB connection established successfully`);
    });
}).catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
});
