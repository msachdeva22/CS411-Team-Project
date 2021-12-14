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
    clearPref:{
        type:String,
        default:""
    },
    cloudyPref:{
        type:String,
        default:""
    },
    rainPref:{
        type:String,
        default:""
    },
    snowPref:{
        type:String,
        default:""
    },
    currentAccToken:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model("User", userSchema);