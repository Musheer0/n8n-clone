import { baseNodeData } from ".";

export interface httpNodeData extends baseNodeData {
    method:"GET"|"POST"|"PUT"|"PATCH"|"DELETE",
    url:string,
    body?:JSON,
}