/** RN-safe unique id (uuid v4 needs crypto polyfill on Hermes) */
export const generateId = (): string =>
  `task_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 11)}`;
