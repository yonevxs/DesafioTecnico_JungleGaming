import { setupWorker } from 'msw/browser';
import { nftHandlers } from './handlers/nftHandlers';
import { orderHandlers } from './handlers/orderHandlers';

export const worker = setupWorker(...nftHandlers, ...orderHandlers);
