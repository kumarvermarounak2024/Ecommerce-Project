const express = require("express");
const cors = require("cors")
const http = require("http");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { cloudinaryConnect } = require("./config/cloudinary");

const database = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const headerRoutes = require("./routes/headerRoutes");
const footerRoutes = require("./routes/footerRoutes");
const offerRoutes = require("./routes/offerRoutes");

const app = express();
const fileUpload = require("express-fileupload");
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
dotenv.config();
database.connectDb();

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

// ✅ Step 3 - Setup CORS
const corsOptions = {
  origin: [
  //  "http://localhost:3900",
  //  "http://localhost:5173", 
  //  "https://ecommercebackend-0xb1.onrender.com", 
    "http://10.0.0.14:3900", //"https://e-commerce-4knu.onrender.com", "https://gyanvidya.online"
    ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

cloudinaryConnect();

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subCategory", subCategoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/header", headerRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/offer", offerRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to ECommerce API");
})

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})