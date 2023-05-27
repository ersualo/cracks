const express = require("express")
const mongoose = require("mongoose")

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, SESSION_SECRET, REDIS_URL, REDIS_PORT } = require("./config/config");

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")
const app = express();
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
	mongoose
	.connect(MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log("DB Connection Stablished"))
	.catch((e) => {
		console.error(e)
		setTimeout(connectWithRetry, 5000)
	});
}

connectWithRetry();

app.get("/", (req, res) => {
	res.send("Backend Running.");
})

app.use(express.json());
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
