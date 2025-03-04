import express,{Router} from "express"
import {
    createPost,
    deletePost,
    getPosts,
    updatePost,
} from "../controllers/postControllers"
import {authMiddleware} from "../middleware/authMidlleware"

const router: Router = express.Router();
router.get("/", authMiddleware, getPosts)
router.post("/", authMiddleware, createPost)
router.put("/:id", authMiddleware, updatePost)
router.delete("/:id", authMiddleware, deletePost)

export default router;