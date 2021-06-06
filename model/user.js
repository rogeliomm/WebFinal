const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = Schema ({
    email: String, 
    password: String
});

UserSchema.methods.encryptPassword = async function(password){
    var salt = await bcrypt.genSalt();
    return bcrypt.hash(password,salt);
}

UserSchema.methods.validatePassword = async function(password) {

    return bcrypt.compare(password,this.password)
}


module.exports = model('user', UserSchema);