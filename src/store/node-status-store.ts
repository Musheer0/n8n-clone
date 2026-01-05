import { atom } from "jotai";
export type node_status = {nodeId:string,status:string}
export const nodeStatusAtom = atom<node_status[]>([])