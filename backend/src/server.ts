import express from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import routes from './routes/routes'
import connectDB from './config/dbConfig';
import cors from 'cors'


dotenv.config()

const app = express()

const PORT = process.env.PORT as string

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.20.6:5173",  // your PC IP
      "*"
    ],
    credentials: true,
  })
);

// 0zmkUtJOHJW4Kun3
// db_users
// mongodb+srv://db_users:0zmkUtJOHJW4Kun3@cluster0.ghwnnrw.mongodb.net/?appName=Cluster0

app.get('/', (req, res)=> {
    res.send('application is running successfully')
})

app.use('/api', routes)

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
  });
};

startServer();