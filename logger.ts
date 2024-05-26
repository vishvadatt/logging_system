import { query } from 'express';
import {appendFile,mkdirSync,existsSync} from 'fs';
import {join} from 'path';
// require('./logs')
const baseLogDir = join(__dirname,'./','logs')

if(!existsSync(baseLogDir)){
    mkdirSync(baseLogDir);
}

function getLogDir(level:LogLevel,company_id?:number):string{
    const date = new Date();
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
    const levelDir = join(baseLogDir,yearMonth,level.toLowerCase());
    // const companyDir = join(levelDir,`C${company_id}`);
    // console.log(baseLogDir); 
    
    let logDir = join(baseLogDir,yearMonth,level.toLowerCase())

    if(company_id !== undefined){
        logDir = join(logDir,`C${company_id}`)
    }else{
        logDir = join(logDir,'common')
    }
// ensure log directory exists
    if(!existsSync(logDir)){
        mkdirSync(logDir,{recursive : true});
    }
    return logDir
}

// const logFile = join(logDir,'app.log');

enum LogLevel {
    INFO = 'INFO',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
    SUCCESS = 'SUCCESS',
    REQUEST = 'REQUEST'
}

function log(level:LogLevel,message : string,company_id?:number):void{
    const logDir = getLogDir(level,company_id);
    const date = new Date();
    const dateString = date.toISOString().split('T')[0];
    const logFile = join(logDir,`${dateString}.log`);
    const timestamp = date.toISOString();
    const logMessage = `${timestamp}\n${level}:${message}\n`;
    appendFile(logFile,logMessage,(err)=>{
        if(err){
            console.error('Failed to write to log file'+err);
        }
    });
}

export function logInfo(messsage:string, companyId?:number){
    log(LogLevel.INFO,messsage, companyId)
}

export function logError(message:string, companyId?:number){
    log(LogLevel.ERROR,message, companyId)
}

export function logDebug(message:string,companyId?:number):void{
    log(LogLevel.DEBUG,message, companyId)
}

export function logSuccess(message:string, companyId?:number):void{
    log(LogLevel.SUCCESS,message, companyId)
}

export function logRequest(message:string,params:any,qureyStr:any,payload:any,companyId?:number):void{
    console.log(params,qureyStr,payload);
    
    const payloadString = JSON.stringify(payload);
    const queryString = JSON.stringify(qureyStr);
    const paramsString = JSON.stringify(params);
    log(LogLevel.REQUEST,`${message} - \nParams:${paramsString}\nQuery:${queryString}\npayload:${payloadString}\n`,companyId)
}