import { InferSelectModel,InferEnum } from "drizzle-orm";
import { credentails, CredentialsTypeDb } from "../../../drizzle/schema";
export type tCredentailsType = InferEnum<typeof CredentialsTypeDb>
export type tcredentials = InferSelectModel<typeof credentails>