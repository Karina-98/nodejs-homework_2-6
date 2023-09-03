const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar")
const path = require("path")
const fs = require("fs/promises")
require("dotenv").config()

const { ctrlWrapper, HttpError } = require("../helpers")
const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const registration = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email})

    if (user) {
        throw HttpError(409, "Email in use")
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email)
    
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL})
    
    res.status(201).json({
       message:  "registered successfully",
    })
}

const login = async (req, res) => { 
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    

    if (!user) { 
        throw HttpError(401, "Email or password is wrong")
    }

    const passwordCompare = await bcrypt.compare(password, user.password)

    if (!passwordCompare) { 
        throw HttpError(401, "Email or password is wrong")
    }

    const payload = {
        id: user._id
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, {token})
    res.json({
        token
    })
}

const getCurrent = async (req, res) => { 
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription
    })
}


const logout = async (req, res) => { 
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" })

    res.json({
        message: "Logout success"
    })
}

const updateAvatar = async (req, res) => { 
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;

    const fileName = `${_id}_${originalname}`

    const resultUpload = path.join(avatarsDir, fileName);
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join("avatars", fileName);
    await User.findByIdAndUpdate(_id, { avatarURL })
    res.json({
        avatarURL,
    })
}

module.exports = {
    registration: ctrlWrapper(registration),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    
}