import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { workflowsRouter } from './workflows';
import { nodes_edges_router } from './nodes_edges';
export const appRouter = createTRPCRouter({
  workflow :workflowsRouter,
  nodes_edges:nodes_edges_router
});
// export type definition of API
export type AppRouter = typeof appRouter;