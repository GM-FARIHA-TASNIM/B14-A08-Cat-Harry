const verifyToken = async (req, res, next) => {
  try {
    const { createRemoteJWKSet, jwtVerify } = await import("jose");

    const authBaseURL = (
      process.env.BETTER_AUTH_URL ||
      process.env.CLIENT_URL ||
      "http://localhost:3000"
    ).replace(/\/$/, "");

    const JWKS = createRemoteJWKSet(new URL("/api/auth/jwks", authBaseURL));

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: authBaseURL,
      audience: authBaseURL,
    });

    if (!payload.sub || !payload.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyToken;
