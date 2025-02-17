import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
});

userSchema.methods.hashPassword = async function(){
    const SALT_ROUNDS = process.env.SALT_ROUNDS;
    return await bcrypt.hash(this.password, SALT_ROUNDS);
}

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;