import mongoose from "mongoose";
import validator from "validator"       

const userSchema = new mongoose.Schema({
    username: {type: String, required: true },
    email: {type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(value){
                return validator.isEmail(value);        //Validator npm package used for validating email format
            },
            message: "Invalid email format"
        }
    },
    password: {type: String, required: true},
    profilePic: {type: String}
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;