import jwt from "jsonwebtoken"
import BlacklistToken from '../models/tokenblacklistmodel.js';
const Blacklist = BlacklistToken;

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
        return res.status(403).json({
            success: false,
            msg: 'A token is required for authentication'
        });
    }

    try {
        //use logic to handle both accesstoken and refresh token if different secret is used for both
        //currently same
        const bearer = token.split(' ');
        const bearerToken = bearer.length > 1 ? bearer[1] : bearer[0];

        //blacklisting token from logout in db 
        const blacklistedToken = await Blacklist.findOne({token: bearerToken});
        
        if(blacklistedToken){
            return res.status(400).json({
                success: false,
                msg: 'This session has expired, please Login again!'
            });
        }

        const decodedData = jwt.verify(bearerToken, process.env.ACCESS_TOKEN);
        req.user = decodedData;
        next();


    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: 'Invalid Token'
        });
    }
};

export default verifyToken;

//exported as auth in userroutes
