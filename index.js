require('dotenv').config();
const express = require('express'); // crear el express  -- con la etiqueta const se agrega 
const mongoose =require('mongoose');
const bodyParser = require('body-parser');
//const verify = require('./middlewares/verifyToken');
//const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const PORT = process.env.PORT; 
//const PORT = process.env.PORT || 3000; // declaración de constantes variable del entorno puerto
const mongoUrl = 'mongodb+srv://administrador:administrador@clusterdev-fi9jc.gcp.mongodb.net/test?retryWrites=true&w=majority';
 
mongoose.connect(mongoUrl, {useNewUrlParser: true}, (err) => {
    if(!err){
        console.log('mongo conectado correctamente');
    }
});
const {user} = require('./models/user');
//const {user} = require('./models/user');
const {jwt} =require('./services/jwt');
//const {user} = require('./controllers/auth'); 
// lleva las llaves {} para llamar a todas las propiedades  un objeto
//const(ya esta definida y no la  puedo redefinir)   var(no me indica si esta definada antes )  let(muestra que la variable)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// crear ruta padre

app.get('/', (req, res) => {
    res.send('<h1>HOLA MUNDO</h1>');
});

// mongodb+srv://administrador:administrador@clusterdev-fi9jc.gcp.mongodb.net/test?retryWrites=true&w=majority
// se comunica con mongodb con parametros del objeto se maneja por esquemas(tablas la base) la respuesta es siempre por objetos

// app.post('/new/user', (req, res) register);
app.post('/new/user', (req, res) => {
    let params = req.body;
    if (params.email && params.password && params.name) {
        user.findOne({ email: params.email }, (err, respuesta) => {
            if (err) {
                res.status(500).json({ message: 'Ocurrio un Error' });
            } else if (respuesta !== null) {
                res.status(200).json({ message: `El correo ${params.email} ya esta en uso` });
            } else {
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(params.password, salt, function(err, hash) {
                        let newUser = user({
                            name: params.name,
                            email: params.email,
                            password: hash
                        });
                        newUser.save((err, resp) => {
                            if(err){
                                res.status(500).json({message: 'Ocurrio un error', err});
                            } if(resp) {
                                newUser.password = ':('
                                res.status(201).json({status: 'Ok', data: resp});
                            } else {
                                res.status(400).json({message: 'No se creo el usuario'});
                            }
                        });
                        
                    });
                });
            }
        })
    } else {
        res.status(400).json({ message: 'Sin datos' })
    }
})

app.post('/login', (req, res) => {
    let params = req.body;
    if (params.email && params.password ) {

        user.findOne({ email: params.email }).exec((err, user) => {
            if (err) {
                //res.status(500).json({ message: 'Ocurrio un Error' });
                res.status(500).send('Ocurrio un Error', err);
            } 
            if (user){
               // res.status(200).json({ message: `El correo ${user.email} ya esta en uso` });
                bcrypt.compare(params.password, user.password , (err, response) =>{
                    if(response){
                        user.password ='=(';
                        res.status(200).json({
                            status: 'ok',
                            data: response,  // user 
                            token: jwt.createToken(user)
                        })
                    }else{
                        res.status(400).json({message: 'error'});
                    }
                })
            }
            
           
        })
    } else {
        res.status(400).json({ message: 'Sin datos' })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor Escuchando en port ${PORT}`);
})