import express,{Router} from "express"
import {authMiddleware} from "../middleware/authMidlleware"
import {createLike, deleteLike} from "../controllers/likeControllers"


const router: Router = express.Router();
router.post("/", authMiddleware, createLike)
router.delete("/", authMiddleware, deleteLike)

export default router