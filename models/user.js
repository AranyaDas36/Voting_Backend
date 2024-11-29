const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        require: true
    },
    email:{
        type: String
    },
    mobile:{
        type: String
    },
    address:{
        type: String,
        required: true
    },
    addharCardNumber:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
        required: true
    },
    isVoted: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function (next) {
    const bcrypt = require('bcrypt');
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw new Error('Password comparison failed');
    }
};


const User = mongoose.model('User', userSchema)
module.exports = User;