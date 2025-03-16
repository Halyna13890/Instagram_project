import express,{Router} from "express"
import {authMiddleware} from "../middleware/authMidlleware"
import{
    getAllFollowers,
    getFollowing,
    toggleFollowing,
    getFollowersNotifications,
    checkFollowingForUsers
} from "../controllers/followerController"


const router: Router = express.Router();

router.post('/followers/check', authMiddleware, checkFollowingForUsers)
router.get('/followers/:userId', authMiddleware, getAllFollowers)
router.get('/following/:userId', authMiddleware, getFollowing)
router.post('/toggle/:follovingUser', authMiddleware, toggleFollowing)
router.get('/time', authMiddleware, getFollowersNotifications)



export default router