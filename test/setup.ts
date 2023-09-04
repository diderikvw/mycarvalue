import { rm } from 'fs/promises';
import { join } from 'path';

// This is a "global" beforeEach that runs before every e2e test
global.beforeEach(async () => {
  // In case the test.sqlite file does not exist, do not throw an error, just continue
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});