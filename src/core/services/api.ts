
// LEGACY API ENTRY POINT
// Redirecting to new service modular architecture
export * from '../../services';

import { USE_MOCK as CONFIG_USE_MOCK } from '../../services/config';
export const USE_MOCK = CONFIG_USE_MOCK;
