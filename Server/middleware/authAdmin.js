const Users = require('../models/user')

const authAdmin = async (req,res, next) =>{

    try {
        const user = await Users.findOne({_id:req.user.id})

        if(user.role !== 1)
            return res.status(400).json({msg: "Admin resoures access denied."})
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}
module.exports = authAdmin