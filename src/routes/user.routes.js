// src/routes/user.routes.js
import express from 'express';
import { resisterUser } from '../controllers/user.controller.js';
import upload from "../middlewares/multer.middlewares.js"

const router = express.Router();

router.route("/resister").post(
    upload.fields(
        {name: 'avatar',
            maxCount : 1
        },
        {name: 'coverImage',
            maxCount : 1
        }
    ),
    resisterUser
);



export default router;
