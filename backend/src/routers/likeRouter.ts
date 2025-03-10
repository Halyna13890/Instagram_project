import express,{Router} from "express"
import {authMiddleware} from "../middleware/authMidlleware"
import {toggleLike} from "../controllers/likeControllers"


const router: Router = express.Router();
router.post('/toggle', authMiddleware, toggleLike)


export default router