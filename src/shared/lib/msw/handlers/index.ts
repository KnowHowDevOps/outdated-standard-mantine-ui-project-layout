/**
 * MSW request handlers
 *
 * This file exports all mock handlers for different API endpoints.
 * Handlers are organized by feature/domain.
 */

import { authHandlers } from "./auth";
import { userHandlers } from "./users";
import { commonHandlers } from "./common";

/**
 * All MSW handlers combined
 */
export const handlers = [...authHandlers, ...userHandlers, ...commonHandlers];
