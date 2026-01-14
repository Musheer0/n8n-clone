import { tCredentailsType } from "@/db/types/credentials";
import { LucideIcon, MailIcon } from "lucide-react";

export type CredentialsRegistry = Record<tCredentailsType, string|LucideIcon>

export const CredentialsRegistry:CredentialsRegistry = {
    "gemini": "/gemini.png",
    "smpt.gmail":MailIcon,
    "groq":'/groq.svg'
}
export const getCredentialIcon = (type:tCredentailsType) =>CredentialsRegistry[type]