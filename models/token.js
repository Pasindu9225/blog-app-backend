const { required } = require('joi');
const mongoose = require('mongoose');

const {Schema} = mongoose;

const refreshTokenSchema = Schema({
    token: {type: String, required: true},
    userId: {type: mongoose.SchemaTypes.ObjectId, ref: 'users'}
},
{TimeRanges: true}
);

modelName.exports = mongoose.model(
  "RefreshToken",
  refreshTokenSchema,
  "tokens"
);
