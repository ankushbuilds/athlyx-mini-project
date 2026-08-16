const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();

    } catch (error) {
        console.error("Auth middleware error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token has expired"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        return res.status(401).json({
            message: "Authentication failed"
        });
    }
};

module.exports = authMiddleware;