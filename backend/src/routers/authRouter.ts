import express, {Router} from "express"
import { registerUser, loginUser, getEditProfile, updateEditProfile } from "../controllers/authControllers"
import { authMiddleware } from "../middleware/authMidlleware"

const router:Router = express.Router()
router.post("/register", registerUser)
router.post("/login", loginUser)
router.put("/editprofile", authMiddleware, updateEditProfile)
router.get("/editprofile", authMiddleware, getEditProfile)

export default router