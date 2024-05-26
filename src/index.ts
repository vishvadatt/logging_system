import express ,{Express,NextFunction,Request,Response} from 'express'
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import {logDebug,logError,logInfo,logRequest,logSuccess} from '../logger'
import bodyParser from 'body-parser';
import serveStatic from 'serve-static';
import logRequestMiddleware from '../logRequestMiddleware ';

const app:Express = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))

app.use('/logs',express.static(path.join(__dirname,'public')),serveStatic('public'))


// require('../logs')
app.get("/",(req:Request,res:Response)=>{
    const company_id = 2
    logInfo('Root endpoint hit',company_id);
    res.send("Express + Typescript Server");
});

app.get('/error',(req:Request,res:Response) => {
    const company_id = 2
    logError('error endpoint hit',company_id);
    res.status(500).json("This is an error")
})

app.get('/debug',(req:Request,res:Response) => {
    const company_id = 2
    logDebug("debug endpoint hit",company_id);
    res.send('This is a debug message')
})

app.get('/success',(req:Request,res:Response) => {
    const company_id = 2
    logSuccess('success endpoint hit',company_id);
    res.send("THis is a success message");
})
app.post('/test',(req:Request,res:Response) => {
    
    try {
        console.log(req.body);
    } catch (e) {
        console.log(e);
        
    }
    
});

app.get('/items/:id', logRequestMiddleware,(req:Request,res:Response) => {
    
    logInfo(`Item endpoint hit with the ID: ${req.params}`);
    res.send(`Item ID: ${req.params.id}`)
})

app.post('/items',logRequestMiddleware,(req:Request,res:Response) => {
    logInfo(`POST Item endpoint hit with the ID: ${JSON.stringify(req.body)}`)
    res.send("Item post")
})
// middleware for logging request
app.use((req:Request,res:Response,next:NextFunction) => {
    console.log("LOG",req.method,req.url, req.params);
    // const company_id = 2
    logRequest(`${req.method} ${req.url}`,req.params, req.query, req.body);
    next();
});
app.use((err:Error,req:Request,res:Response,next:NextFunction) => {
    const company_id = 2
    logError(err.stack || err.message,company_id);
    res.status(500).send('Something broke')
})
app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);
})