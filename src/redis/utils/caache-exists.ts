import { redis } from "../client"

export const checkCacheAndQuery = async<T>(key:string,fallback:()=>Promise<T|null|undefined>)=>{
    const cache = await redis.get<T>(key);
    if(cache) return cache;
    console.log(`CACHE MISS [${key}]`);
    const data = await fallback();
 
    return data
}