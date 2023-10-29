const jwt = require("jsonwebtoken")
const {SECRET} = require("./config")
const Session = require("../models/session")
const {User} = require("../models")

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            const token = authorization.substring(7)
            req.token = token
            req.decodedToken = jwt.verify(token, SECRET)

            const session = await Session.findOne({
                where: { token: token },
            })

            if (!session){
                return res.status(401).send({ message: 'Session is invalid'})
            }
            req.session = session

            const user = await User.findByPk(req.decodedToken.id)

            if (user.disabled){
                return res.status(401).send({ message: 'User is disabled'})
            }

        } catch{
            return res.status(401).json({ error: 'token invalid' })
        }
    }  else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

module.exports = { tokenExtractor }