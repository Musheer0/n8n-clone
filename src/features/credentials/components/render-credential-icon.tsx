import { tCredentailsType } from '@/db/types/credentials'
import React from 'react'
import { getCredentialIcon } from '../credentials-registry'

const RenderCredentialIcon = ({type,className}:{type:tCredentailsType,className:string}) => {
    const Icon = getCredentialIcon(type)
  return (
    <>
    {typeof Icon === "string"
    ?
        <img src={Icon} alt={type} className={className}/>
        :
        <Icon className={className}/>
}
    </>
  )
}

export default RenderCredentialIcon
