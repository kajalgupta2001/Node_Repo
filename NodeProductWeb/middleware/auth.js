const User = require('../model/users')
const jwt = require('jsonwebtoken')
const auth = async(req,resp,next)=>{

    const token = req.cookies.token
   
    
    
    try {
        const user  =  await jwt.verify(token,process.env.S_KEY)

        const CurrentUser = await User.findById(user._id)

        if(user)
        {
            const isValid =  CurrentUser.Tokens.find(ele=> {
                return ele.token==token
            } )

            if(isValid){
                req.user = CurrentUser
                req.token = token
                next()
            }
            else{
                resp.render("login",{"err":"Please login first !!!"})
            }
            
        }

    } catch (error) {
        resp.render("login",{"err":"Please login first !!!"})
    }
    
}

module.exports = auth;