const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require: true,
        unique:true,
        min:4
    },
    password:{
        type:String,
        require:true,
        min:6
    },
    city:{
        type:String,
        require:true
    },
    preferences:{
        type:Array,
        default:[]
    },
    currentAccToken:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model("User", userSchema);