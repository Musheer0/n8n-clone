import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { redis } from "@/redis/client";
import * as schema from "../../drizzle/schema";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql",
    schema
  }), 
  experimental:{joins:true},
  rateLimit:{
   enabled:true,  
   storage:"secondary-storage", 
  },
  secondaryStorage:{
    get:async(key)=>{
      const value = await redis.get(key)
      return value
    },
    delete:async(key)=>{
      await redis.del(key)
    } ,
    async set(key, value, ttl) {
   		if (ttl) await redis.set(key, value, { ex: ttl });
		else await redis.set(key, value);
    },
  },
  session:{
    cookieCache:{
      strategy:"compact",
      enabled:true
    },
    storeSessionInDatabase:true
  },
  socialProviders:{
    github:{
      clientId:process.env.GITHUB_CLIEND_ID!,
      clientSecret:process.env.GITHUB_CLIENT_SECRET!
    }
  }
});

export const requireAuth = async()=>{
  const session = await auth.api.getSession({headers:await headers()});
  if(!session?.user) redirect('/login');
  return session
}
export const requireUnAuth = async()=>{
  const session = await auth.api.getSession({headers:await headers()});
  if(session?.user) redirect('/');
}
