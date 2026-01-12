import { InferSelectModel } from "drizzle-orm";
import { execution_status } from "../../../drizzle/schema";

export type texecution_status = InferSelectModel<typeof execution_status>