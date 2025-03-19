import express, {Router} from "express"
import { registerUser, 
    loginUser, 
    getProfile, 
    updateEditProfile, 
    requestPasswordReset, 
    resetPassword,
    searchUser} from "../controllers/userControllers"
import { authMiddleware } from "../middleware/authMidlleware"
import { uploadMiddleware } from "../middleware/uploadMidlleware"

const router:Router = express.Router()
router.post("/register", registerUser)
router.post("/login", loginUser)
router.put("/profile/:id", authMiddleware, uploadMiddleware.single("image"), updateEditProfile)
router.get("/profile/:id", authMiddleware, getProfile)
router.post("/forgot-password", authMiddleware,requestPasswordReset);
router.post("/reset-password/:token", authMiddleware, resetPassword);
router.get("/search", authMiddleware, searchUser)

export default router

