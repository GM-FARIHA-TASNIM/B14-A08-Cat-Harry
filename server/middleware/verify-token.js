let jwksPromise;

const getJWKS = async () => {
  if (!jwksPromise) {
    jwksPromise = (async () => {
      const { createRemoteJWKSet } = await import("jose");

      const authBaseURL = (
        process.env.BETTER_AUTH_URL ||
        process.env.CLIENT_URL ||
        "http://localhost:3000"
      ).replace(/\/$/, "");

      const JWKS = createRemoteJWKSet(new URL("/api/auth/jwks", authBaseURL));

      return { JWKS, authBaseURL };
    })();
  }

  return jwksPromise;
};

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    const { jwtVerify } = await import("jose");
    const { JWKS, authBaseURL } = await getJWKS();

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: authBaseURL,
      audience: authBaseURL,
    });

    if (
      typeof payload.sub !== "string" ||
      !payload.sub ||
      typeof payload.email !== "string" ||
      !payload.email
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    return next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyToken;
