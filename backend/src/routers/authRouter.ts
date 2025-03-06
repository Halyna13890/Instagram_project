import express, {Router} from "express"
import { registerUser, loginUser, getProfile, updateEditProfile } from "../controllers/authControllers"
import { authMiddleware } from "../middleware/authMidlleware"
import { uploadMiddleware } from "../middleware/uploadMidlleware"

const router:Router = express.Router()
router.post("/register", registerUser)
router.post("/login", loginUser)
router.put("/profile/:id", authMiddleware, uploadMiddleware.single("image"), updateEditProfile)
router.get("/profile/:id", authMiddleware, getProfile)

export default router