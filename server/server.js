const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const topicRoutes = require("./routes/topicRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const allocationRoutes = require("./routes/allocationRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/allocation", allocationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Fair Topic Allotment API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//faculty
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTZhYzZjZjNjYzczMWNlNTFhMzIzNiIsInJvbGUiOiJmYWN1bHR5IiwiaWF0IjoxNzcxNDgyMjIwLCJleHAiOjE3NzIwODcwMjB9.TYizoSRfrWe51Wa9MoEBBwryH3CIA3ohRG8Mi-sCA1c

//student 
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTVjZDVhZGI1NDVjMzE3YTk0ZjI1YSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzcxNDI1MjY3LCJleHAiOjE3NzIwMzAwNjd9.oO_xEwbH4GOZaanXURtedjoFPJUuIg079oAKo13BDBs
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTliNGFhOThkNDJhM2VkMDY0Mzg1OCIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzcxNjgwOTg1LCJleHAiOjE3NzIyODU3ODV9.P1pF0JAnSYrcUCxXeVWSOBll1R4PzDzzY2wjiiyF13w
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTliNTFlOThkNDJhM2VkMDY0Mzg1ZCIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzcxNjgxMDkyLCJleHAiOjE3NzIyODU4OTJ9.Eokgrk5L1ycBtjXeuxB-YKj6oPPXE1-EqJy97oZOmKs


//admin
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTliMjViOThkNDJhM2VkMDY0Mzg1NCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MTY4MDc0MCwiZXhwIjoxNzcyMjg1NTQwfQ.GFKOH07E5Nws2PtI9zp_-8Ia0gZ4uTq5XBT_rSrVDjo

//checking purpose
const { protect } = require("./middleware/authMiddleware");

app.get("/api/protected", protect, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route",
    user: req.user,
  });
});

const { authorizeRoles } = require("./middleware/authMiddleware");

app.get(
  "/api/admin-only",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin!",
    });
  }
);

