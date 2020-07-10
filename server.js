const express = require('express');
const { response } = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

db.select('*').from('users')
    .then(data => {
        
    });

const app = express();

app.use(express.json());
app.use(cors());

// requests
// / --> response = this is working
app.get('/', (request, response) => {
    response.send(database.users)
})

// /signIn --> POST = success/ fail
app.post('/signIn', (request, response) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', request.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(request.body.password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', request.body.email)
                    .then(user=> {
                        response.json(user[0]);
                    })
                    .catch(error => response.status(400).json('Unable to retrieve user'));
            } else {
                response.status(400).json('Incorrect credentials');
            }
        })
        .catch(error => response.status(400).json('Unable to sign in user with incorrect credentials'));
})

// /register --> POST =user
app.post('/register', (request, response) => {
    const {email, name, password} = request.body;

    const hash = bcrypt.hashSync(password);

    bcrypt.compareSync(password, hash); // true
    bcrypt.compareSync("veggies", hash); // false

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
        .returning('*')
        .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
        })
        .then(user => {
            response.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(error => response.status(400).json('Unable to register.'));
})


// /profile/:userId --> GET = user
app.get('/profile/:id', (request, response) => {
    const {id} = request.params;

    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        if (user.length) {
            response.json(user[0]);
        } else {
            response.status(404).json('user not found')
        }
    })
    .catch(error => response.status(404).json('Error getting user'));
})


// /image --> PUT --> updated user object
app.put('/image', (request, response) => {
    const {id} = request.body;
    
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        response.json(entries[0]);
    })
    .catch(error => response.status(400).json('Unable to retrieve entries'));
})


// bcrypt.hash(password, null, null, function(err, hash) {
//     console.log(hash);
// });



app.listen(3000, () => {
    console.log('smooth sailing on port 3000')
});
