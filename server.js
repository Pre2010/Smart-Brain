const express = require('express');
const { response } = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

// how we connect to the db
const db = knex ({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : 'test123',
        database : 'smart-brain'
    }
});

// example of using knex
// db.select('*').from('users')
//     .then(data => {
        
//     });

const app = express();

app.use(express.json());
app.use(cors());

// requests
// / --> response = this is working
app.get('/', (request, response) => {response.send(database.users)})

// /signIn --> POST = success/ fail
app.post('/signIn', (request, response) => {signIn.handleSignIn(request, response, db, bcrypt)})

// /register --> POST =user
// (request, response, db, bcrypt) - dependency inject. We are passing whatever dependencies handleRegister needs
app.post('/register', (request, response) => {register.handleRegister(request, response, db, bcrypt)});

// /profile/:userId --> GET = user
app.get('/profile/:id', (request, response) => {profile.handleProfileGet(request, response, db)});

// /image --> PUT --> updated user object
app.put('/image', (request, response) => {image.handleImage(request, response, db)});
app.post('/imageurl', (request, response) => {image.handleApiCall(request, response)});

// tells node/express what port to listen to
// convention is to cap the PORT variable since it is an environmental variable
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('smooth sailing on port ', PORT);
});
