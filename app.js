require("dotenv").config();

const express = require("express"); 
const app = express();
const cors = require("cors");
const connectDB = require("./conn/conn.js");
connectDB();

const User = require("./routes/user.js");
const Books = require("./routes/book.js");
const Favourite = require("./routes/favourite.js");
const Cart = require("./routes/cart.js");
const Order = require("./routes/order.js");

app.use(cors());
app.use(express.json());
//Routes
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

//Creating Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
