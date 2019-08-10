const jwt = require('jsonwebtoken'); // importar variable 
const secret = 'nreufnrufnrufnerufnplfk944';
exports.createToken = (user) => {
    
    return jwt.sign({user}, secret, {expiresIn: '1hr'})
}