import { InferInsertModel, InferSelectModel,InferEnum } from "drizzle-orm";
import {NodeTypeDb, workflows} from '../../../drizzle/schema'
export type tworkflow = InferSelectModel<typeof workflows>
export type tworkflow_input = InferInsertModel<typeof workflows>
export type tnode_type = InferEnum<typeof NodeTypeDb>