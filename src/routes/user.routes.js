// src/routes/user.routes.js
import express from 'express';
import { resisterUser , loginUser , logOutUser } from '../controllers/user.controller.js';
import { upload } from "../middlewares/multer.middlewares.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.route("/resister").post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    resisterUser
);

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)

   
export default router;

