import { tCredentailsType } from "@/db/types/credentials";
import { LucideIcon, MailIcon } from "lucide-react";

export type CredentialsRegistry = Record<tCredentailsType, string|LucideIcon>

export const CredentialsRegistry:CredentialsRegistry = {
    "gemmini": "./gemini.png",
    "smpt.gmail":MailIcon
}
export const getCredentialIcon = (type:tCredentailsType) =>CredentialsRegistry[type]