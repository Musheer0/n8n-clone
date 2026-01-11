import Crypto from 'crypto-js'
export const encrypt = (secret:string,value:string)=>{
    const encrypted_text = Crypto.AES.encrypt(value,getSecret(secret)).toString();
    return encrypted_text
}
export const decrypt = (secret:string,value:string)=>{
    const decrypted_text = Crypto.AES.decrypt(value,getSecret(secret)).toString(Crypto.enc.Utf8);
    return decrypted_text
}

export const getSecret = (prefix:string)=> `${prefix}-${process.env.ENCRYPT_SECRET}`
