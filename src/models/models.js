const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["patient","Doctor"],
        required:true
    },
    password:{
        type:String,
        required:true
    },
    schedule: [
    {
        day: {
            type: String,
            enum: [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday"
            ]
        },
        startTime: String,
        endTime: String
    }
]
})
const User = mongoose.model("User",userSchema);
module.exports = User;