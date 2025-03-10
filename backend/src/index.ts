import "dotenv/config"
import express, {Application, Request, Response} from "express"
import connectDb from "./config/config";
import userRouter from "./routers/userRouter"
import postRouter from "./routers/postRouter"
import likeRouter from "./routers/likeRouter"
import commentRouter from "./routers/commentRouter"
import followerRouter from "./routers/followerRouter"




const app: Application = express();
app.use(express.json())
connectDb()

const PORT = process.env.PORT || 3333;
const MONGO_URI = process.env.MONGO_URI

app.use('/user', userRouter)
app.use('/posts', postRouter)
app.use('/like', likeRouter)
app.use('/comment', commentRouter)
app.use('/follow', followerRouter)


app.get("/", (reg: Request, res: Response) => {
    res.status(200).json({message: "Hello on Homepage"})
})




app.listen(PORT, () =>{
    console.log(`Server is running on port: ${PORT}`);
    
})






