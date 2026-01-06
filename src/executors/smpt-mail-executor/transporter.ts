import nodemailer from 'nodemailer'

export const createTranspoter = (user:string,pass:string)=> {
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user, pass
        }
    });
    return transporter
}