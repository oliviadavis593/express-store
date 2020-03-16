require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config') 
const uuid = require('uuid/v4')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())

//Declare an array to store the users:
const users = [
    //added 2 sample users to array 
    {
        "id": "3c8da4d5-1597-46e7-baa1-e402aed70d80",
        "username": "sallyStudent",
        "password": "c00d1ng1sc00l",
        "favoriteClub": "Cache Valley Stone Society",
        "newsLetter": "true"
      },
      {
        "id": "ce20079c-2326-4f17-8ac4-f617bfd28b7f",
        "username": "johnBlocton",
        "password": "veryg00dpassw0rd",
        "favoriteClub": "Salt City Curling Club",
        "newsLetter": "false"
      }
];

app.post('/user', (req, res) => {
    //get the data
    const { usersname, password, favoriteClub, newsletter=false } = req.body; 

    //validation code here 
    if(!username) {
        return res
            .status(400)
            .send('Username required')
    }

    if(!password) {
        return res
            .status(400)
            .send('Password required')
    }

    if(!favoriteClub) {
        return res 
            .status(400)
            .send('favorite Club required')
    }

    //make sure username is correctly formatted
    if(username.length < 6 || usersname.length > 20) {
        return res
            .status(400)
            .send('Username must be between 6 and 20 characters')
    }

    //password length
    if(password.length < 8 || password.length > 36) {
        return res 
            .status(400)
            .send('Password must be between 8 and 36 characters')
    }

    //password contains digits, using a regex here 
    if(!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
        return res  
            .status(400)
            .send('Password must contain at least one digit')
    }

    const clubs = [
        'Cache Valley Stone Society',
        'Ogden Curling Club',
        'Park City Curling Club',
        'Salt City Curling Club',
        'Utah Olympic Oval Curling Club'
    ]

    //make sure club is valid 
    if(!clubs.includes(favoriteClub)) {
        return res
            .status(400)
            .send('Not a valid club')
    }

    const id = uuid()
    const newUser = {
    id, 
    username, 
    password, 
    favoriteClub, 
    newsLetter
}

users.push(newUser);

    //at this point all validation passed
    //Note: Ensure you test each of the validation options (Postman)
    res.send('All validation passed')
})


app.get('/user', (req, res) => {
    //returns the list of users
    res.json(users);
})

app.delete('/user/:userId', (req, res) => {
    const { userId } = req.params; 
    //console.log(userId);

    const index = users.findIndex(u => u.id === userId);

    //make sure we actually find a user with that id 
    if(index === -1) {
        return res
            .status(404)
            .send('User not found')
    }

    users.split(index, 1);

    //Don't need this => we can responsed w. 404 No Content
    //res.send('Deleted')

    res.status(404).end();
})

app.use((error, req, res, next) => {
    let response

    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error '}}
    } else {
        console.error(error)
        response = { error }
    }
    res.status(500).json(response)
})

module.exports = app; 