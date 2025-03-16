import express,{Router} from "express"
import {uploadMiddleware} from "../middleware/uploadMidlleware"
import {
    createPost,
    getUserPosts,
    deletePost,
    getAllPosts,
    updatePost,
    getOnePost,
} from "../controllers/postControllers"
import {authMiddleware} from "../middleware/authMidlleware"

const router: Router = express.Router();
router.get("/", authMiddleware, getAllPosts)
router.get("/onepost/:id", authMiddleware, getOnePost)
router.get("/oneuser/:id", authMiddleware, getUserPosts)
router.post("/", authMiddleware, uploadMiddleware.single("image"), createPost)
router.put("/:id", authMiddleware, uploadMiddleware.single("image"), updatePost)
router.delete("/:id", authMiddleware, deletePost)

export default router