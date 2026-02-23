const usermodel = require("../models/user.model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

async function registercontroller(req, res) {
    const { email, username, password } = req.body;

    const isalreadyexist = await usermodel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isalreadyexist) {
        return res.status(409).json({
            message: "user already exist " + isalreadyexist.email == email ? "email is already register " : "username is already register"

        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await usermodel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username

    }, process.env.JWT_Secret, { expiresIn: "1d" })


    res.cookie("token", token);

    return res.status(200).json({
        message: "user register successfully",
        user: {
            username: user.username,
            email: user, email
        }
    })
}

async function logincontroller(req, res) {
    const { username, email, password } = req.body;

    const user = await usermodel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!user) {
        return res.status(404).json({
            message: "user not found"
        })
    }

    const ispassword = await bcrypt.compare(password, user.password);

    if (!ispassword) {
        return res.status(401).json({
            message: "password is wrong"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_Secret,
        { expiresIn: "1d" }

    )

    res.cookie("token", token);

    return res.status(200).json({
        message: "user logged in successfully",
        user: {
            username: user.username,
            email: user.email,
        }
    })
}

module.exports = {
    registercontroller,
    logincontroller
}