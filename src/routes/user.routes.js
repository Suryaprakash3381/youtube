// src/routes/user.routes.js
import express from 'express';
import { resisterUser } from '../controllers/user.controller.js';

const router = express.Router();

router.route("/resister").post(resisterUser);

router.route("/name").get((req, res) => {
    res.send("hello world")
    console.log("hello world")
})
export default router;
