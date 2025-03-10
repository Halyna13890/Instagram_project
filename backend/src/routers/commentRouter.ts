import express,{Router} from "express"
import {authMiddleware} from "../middleware/authMidlleware"
import { createComment, getPostsComments } from "../controllers/commentControllers";


const router: Router = express.Router();
router.post("/create", authMiddleware, createComment)
router.get("/all/:id", authMiddleware, getPostsComments)



export default router