import "dotenv/config"
import express, {Application, Request, Response} from "express"
import connectDb from "./config/config";
import authRouter from "./routers/authRouter"

const app: Application = express();
app.use(express.json())
connectDb()

const PORT = process.env.PORT || 3333;
const MONGO_URI = process.env.MONGO_URI

app.use('/auth', authRouter)


app.get("/", (reg: Request, res: Response) => {
    res.status(200).json({message: "Hello on Homepage"})
})




app.listen(PORT, () =>{
    console.log(`Server is running on port: ${PORT}`);
    
})






