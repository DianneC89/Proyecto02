const jwt = require ('jsonwebtoken');

exports.verifyTkn = (req, res, next )=> {
    let token = req.headers.authorization;
    if (token){
        jwt.verify(token, secret, (err, decode) =>{
            if (err){
                res.status(500).json({message :'Ocurrio un error})
            }
        })
    }
}