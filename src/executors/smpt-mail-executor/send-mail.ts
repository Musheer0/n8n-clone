import {type Transporter} from 'nodemailer'

export const sendGMail = async({content,to,html,transporter,from,subject}:{content?:string,to:string,html?:string,transporter:Transporter,from?:string,subject:string})=>{
   const info = await transporter.sendMail({
        from,to,
        text:content,
        html,
        subject
    })
    return info
}