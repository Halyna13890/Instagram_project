import express,{Router} from "express"
import {authMiddleware} from "../middleware/authMidlleware"
import {toggleLike, getLikeNotifications, checkLikesForPosts} from "../controllers/likeControllers"


const router: Router = express.Router();
router.get('/check', authMiddleware, checkLikesForPosts)
console.log("Маршрут /like/toggle зарегистрирован");
router.post('/toggle', authMiddleware, toggleLike)
router.get('/time', authMiddleware, getLikeNotifications)




export default router