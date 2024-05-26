import {Request,Response,NextFunction} from 'express';
import { logRequest } from './logger';

const logRequestMiddleware = (req:Request,res:Response,next:NextFunction) => {
    
    logRequest(`${req.method} ${req.url}`,req.params, req.query,req.body,req.body.company_id)
    next()
}

export default logRequestMiddleware