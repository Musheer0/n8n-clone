import { tCredentailsType } from "@/db/types/credentials";
export const getCredentialsKey = (userid:string)=> `credentials:${userid}`;
export const getCredentialKey = (id:string ,type:tCredentailsType)=> `credential:${id}:${type}`;
export const getCredentialsByTypeKey = (userId:string ,type:tCredentailsType)=> `credentials:user:${userId}:${type}`;
