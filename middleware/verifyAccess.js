var jwt = require('jsonwebtoken');
var secret = process.env.LLAVE_SECRETA || "";

function verifyToken(req,res,next) {

    var token = req.cookies.token || '';

    //console.log("token", token);
    
    if (!token){
       res.redirect('/login')
    }

    else {

        jwt.verify(token,secret, function(err,decoded){

    if (err) {
        console.log(err);
        return res.redirect('/login')
    }
    else {

        console.log("Decoded: " + decoded.permission);
       req.userId = decoded.id;
        next();
    }

        })
      
    }

}

module.exports = verifyToken;