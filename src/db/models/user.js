import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJson = function () {
  const obj = this.toObjects();
  delete obj.password;
  return obj;
};

export const User = model('user', userSchema);
