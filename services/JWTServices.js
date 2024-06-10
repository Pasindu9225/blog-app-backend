const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET =
  "648a00da769bd71fe0ad2d52e6ffbc3c6ba048f05420392d0ef3ba2a73333711ca2797472859d5f801939ff7960864ef2bf0b16c4578022571e3ff1736f3e0c0";

  const REFRESH_TOKEN_SECRET =
    "8da1d5117b9216d83628cddf35e6c4614ea3248d1c4589db30822d2a6af28b5c54c177df61b49e9133e2c2b82d0d7358a8833d229795dcd201ab8c7fa4a4983e";

class JWTServices {
  signAccesstoken(payload, expiryTime, secret = ACCESS_TOKEN_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiryTime });
  }

  signRefreshToken(payload, expiryTime, secret = REFRESH_TOKEN_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiryTime });
  }
}