import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'super_admin'],
        default: 'admin'
    },
    lastLogin: {
        type: Date,
        default: null
    }
});

adminSchema.methods.hashPassword = async function(){
    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
    return await bcrypt.hash(this.password, SALT_ROUNDS);
}

adminSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;