// src/routes/user.routes.js
import express from 'express';
import { resisterUser } from '../controllers/user.controller.js';

const router = express.Router();

router.route("/resister").post(resisterUser);


export default router;
