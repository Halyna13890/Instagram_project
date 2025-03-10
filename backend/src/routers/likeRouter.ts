import express,{Router} from "express"
import {authMiddleware} from "../middleware/authMidlleware"
import {toggleLike, getLikeNotifications} from "../controllers/likeControllers"


const router: Router = express.Router();
router.post('/toggle', authMiddleware, toggleLike)
router.get('/time', authMiddleware, getLikeNotifications)

export default router