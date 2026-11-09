import { setupWorker } from 'msw/browser';
import { nftHandlers } from './handlers/nftHandlers';
import { orderHandlers } from './handlers/orderHandlers';
import { authHandlers } from './handlers/authHandlers';
import { socketHandler } from './handlers/socketHandler';

export const worker = setupWorker(
  socketHandler,
  ...nftHandlers,
  ...orderHandlers,
  ...authHandlers
);
