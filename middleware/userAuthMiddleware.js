import jwt from "jsonwebtoken";

async function userAuth(req, res, next) {
    const jwtToken = req.headers.authorization;  

    if (!jwtToken || !jwtToken.startsWith('Bearer ')) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    const token = jwtToken.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        if (id) {
            req.user = id;
            // console.log(req.user)
            next();
        } else {
            return res.status(500).json({ message: "User not authenticated" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = userAuth;