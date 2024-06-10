const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET =
  "648a00da769bd71fe0ad2d52e6ffbc3c6ba048f05420392d0ef3ba2a73333711ca2797472859d5f801939ff7960864ef2bf0b16c4578022571e3ff1736f3e0c0";


class JWTServices {
  signAccesstoken(payload, expiryTime, secret) {
    return jwt.sign(payload, secret, { expiresIn: expiryTime });
  }

  signRefreshToken(payload, expiryTime, secret) {
    return jwt.sign(payload, secret, { expiresIn: expiryTime });
  }
}