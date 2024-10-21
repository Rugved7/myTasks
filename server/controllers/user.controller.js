import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

// generate Access & RefreshTokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    })
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })
    return { accessToken, refreshToken }
}

// send access and refresh tokens in cookies
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

// signup
export const signup = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const userExits = await User.findOne({ email })

        if (userExits) {
            return res.status(400).json({ message: "User Already Exits" })
        }
        const user = await User.create({ name, email, password })

        // authenticate
        const { accessToken, refreshToken } = generateTokens(user._id)
        setCookies(res, accessToken, refreshToken)

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    } catch (error) {
        console.log("Error in signup controller");
        res.status(500).json({ message: error.message })
    }
}

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateTokens(user._id)
            setCookies(res, accessToken, refreshToken)

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email
            })
        } else {
            res.status(404).json({ message: error.message })
        }
    } catch (error) {
        console.log("Error logging in the user");
        res.status(500).json({ message: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(403).json({ message: 'No refresh token found' });
        }

        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        await User.updateOne(
            { _id: decodedToken.id },
            { $pull: { refreshTokens: refreshToken } }
        );

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });

        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });

        return res.json({ message: 'User logged out successfully' });
    } catch (error) {
        console.log('Error in logging user out');
        res.status(500).json({ message: error.message });
    }
};