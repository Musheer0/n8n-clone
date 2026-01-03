import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { workflowsRouter } from './workflows';
export const appRouter = createTRPCRouter({
  workflow :workflowsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;