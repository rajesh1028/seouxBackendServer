const express = require('express');
const { connection } = require("./configs/db");

const cors = require("cors");


require("dotenv").config();


const app = express();
const cookieParser = require('cookie-parser')
app.use(cors());
app.use(cookieParser())
app.use(express.json())


app.get('/', (req, res) => {
       res.json({ "msg": "Welcome to Seoux Bodycare! on your " })
})

const { userRouter } = require("./routes/user.route")
app.use("/users", userRouter)



const { authenticate } = require("./middlewares/authenticate.middleware");



const { Categorylist } = require("./routes/CategoryList");
const { Workingproflist } = require("./routes/WorkingProfList");
const { booking } = require("./routes/bookingRoute");
const { timeSlot } = require("./routes/TimeSlot");
const { paymentRouter } = require("./routes/paymentRouter");
const { feedbackRouter } = require("./routes/feedbackRoute");


app.use("/", Categorylist);
app.use("/", Workingproflist);
app.use("/", booking);
app.use("/", timeSlot);
app.use("/payment", paymentRouter);
app.use("/feedback", feedbackRouter);






app.listen(process.env.PORT, async () => {
       try {
              await connection;
              console.log("Connected to Database");
       } catch (error) {
              console.log("Failed while connecting to Database");
              console.log(error);
       }

       console.log(`Listening on ${process.env.PORT}`);
})

