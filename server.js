const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://krishnaking00480_db_user:<Krishna@2006>@ivbooking.v13uy5a.mongodb.net/?appName=IVBooking")

.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const studentSchema = new mongoose.Schema({
    name: String,
    regNo: {
        type: String,
        unique: true   // 🔥 Important
    },
    place: String,
    status: String,
    reason: String
});


const Student = mongoose.model("Student", studentSchema);

// Deadline check
const deadline = new Date("2026-02-17T23:59:59");

app.post("/register", async (req, res) => {

    if (new Date() > deadline) {
        return res.status(400).json({ message: "Registration Closed" });
    }

    try {
        const existing = await Student.findOne({ regNo: req.body.regNo });

        if (existing) {
            return res.status(400).json({ message: "Register Number Already Exists" });
        }

        const student = new Student(req.body);
        await student.save();

        res.json({ message: "Registered Successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.get("/interested", async (req, res) => {
    const data = await Student.find({ status: "Interested" });
    res.json(data);
});

app.get("/notinterested", async (req, res) => {
    const data = await Student.find({ status: "Not Interested" });
    res.json(data);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
