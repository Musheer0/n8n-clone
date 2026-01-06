import { redis } from "../client"

export const checkCacheAndQuery = async<T>(key:string,fallback:()=>Promise<T|null|undefined>,option?:{cache:boolean})=>{
    const cache = await redis.get<T>(key);
    if(cache) return cache;
    console.log(`CACHE MISS [${key}]`);
    const data = await fallback();
    if(option?.cache && data && !cache){
        await redis.set(key,data,{ex:24*7*60*60})
    }
    return data
}