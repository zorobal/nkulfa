import {
  queryGeneric,
  mutationGeneric,
  actionGeneric,
  httpActionGeneric,
} from "convex/server";

export const query = queryGeneric;
export const internalQuery = queryGeneric;
export const mutation = mutationGeneric;
export const internalMutation = mutationGeneric;
export const action = actionGeneric;
export const internalAction = actionGeneric;
export const httpAction = httpActionGeneric;
