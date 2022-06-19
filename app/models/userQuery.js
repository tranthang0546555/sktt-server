const User = require('./User')

class userQuery {

    getUser = email => {
        try {
            const user = User.find({ 'email': email })
            return user
        } catch (error) {
            return null
        }
    }

    createUser = (newUser) => {
        try {
            const user = User.create(newUser)
            return user
        } catch (error) {
            return false
        }
    }

    updateRefreshToken = (email, refreshToken) => {
        try {
            const user = User.findOneAndUpdate({ email }, { refreshToken }, {
                new: true
            })
            return user
        } catch (error) {
            return false
        }
    }
}

module.exports = new userQuery

