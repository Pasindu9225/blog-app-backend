class JWTServices {
  signAccesstoken(payload, expiryTime, secret) {
    return jwt.sign(payload, secret, { expiresIn: expiryTime });
  }

  signRefreshToken(payload, expiryTime, secret) {
    return jwt.sign(payload, secret, { expiresIn: expiryTime });
  }
}