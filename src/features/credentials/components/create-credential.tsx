"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useCreateCredential } from "@/hooks/use-credentials-hook";
import { tCredentailsType } from "@/db/types/credentials";
import { CredentialsRegistry } from "../credentials-registry";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
type Props = {
  children: React.ReactNode;
};

export function CreateCredentialAlertDialog({ children }: Props) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("keyname");
  const [type,setType] = React.useState<tCredentailsType>("gemmini")
  const [credential, setCredential] = React.useState("secret");
  const types = Object.keys(CredentialsRegistry)
  const { mutate, isPending } = useCreateCredential();

  const onCreate = () => {
    mutate(
      {
        name,
        type,
        credential,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setCredential("");
        },
        
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* children = trigger */}
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create credential</AlertDialogTitle>
          <AlertDialogDescription>
            Store your secret safely. We encrypt it before saving.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <Input
          autoComplete="false"
            
            name="credential name"
            placeholder="Credential name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
          autoComplete="false"
          name="credential secret"
            placeholder="Secret / API key"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            type="password"
          />
         <Select

                   onValueChange={(value:tCredentailsType) => setType(value)}
         >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select credential type" defaultValue={type}


        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Available Credential Types</SelectLabel>
          {types.map((type)=>{
            return (
                 <SelectItem key={type} value={type}>{type}</SelectItem>
            )
          })}
       
        </SelectGroup>
      </SelectContent>
    </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onCreate}
            disabled={!name || !credential || isPending}
          >
            {isPending ? "Creating..." : "Create"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
