const User = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const {
    name,
    age,
    contact,
    role,
    password,
    schedule
} = req.body;

        const existingUser = await User.findOne({ contact });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            age,
            contact,
            role,
            password: hashedPassword,
            schedule
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { contact, password } = req.body;

        const user = await User.findOne({ contact });

        if (!user) {
            return res.status(401).json({
                message: "Invalid contact or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid contact or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};