import { authHandlers } from "./auth.handlers";
import { customerHandlers } from "./customer.handlers";
import { managerHandlers } from "./manager.handlers";
import { staffHandlers } from "./staff.handlers";

export const handlers = [...authHandlers, ...customerHandlers, ...managerHandlers, ...staffHandlers];
