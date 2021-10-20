const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user_model')

usersRouter.post('/', async (request, response) => {
    const body = request.body 

    const saltRounds = 10
    if(body.password.length < 3){
        return response.status(401).json({error: "password must be at least 3 characters long"})
    }
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    try{
        const savedUser = await user.save()
        response.json(savedUser)
    }catch(error){
        response.status(401).json({error: error.message})
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id)
    if(user){
        response.json(user)
    }
    else{
        response.status(404).end()
    }
})


module.exports = usersRouter