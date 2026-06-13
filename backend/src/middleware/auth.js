const jwt = require("jsonwebtoken");

const User = require(
  "../modules/auth/auth.model"
);

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    let token = null;

    /*
    |--------------------------------------------------------------------------
    | Get Token
    |--------------------------------------------------------------------------
    */

    const authHeader =
      req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token =
        authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Access denied. No token provided."
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Verify Token
    |--------------------------------------------------------------------------
    */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
    |--------------------------------------------------------------------------
    | Find User
    |--------------------------------------------------------------------------
    */

    const user = await User.findById(
      decoded.id
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Attach User
    |--------------------------------------------------------------------------
    */

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      plan: user.plan
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;
