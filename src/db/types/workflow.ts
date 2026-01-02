import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {workflows} from '../../../drizzle/schema'
export type tworkflow = InferSelectModel<typeof workflows>
export type tworkflow_input = InferInsertModel<typeof workflows>