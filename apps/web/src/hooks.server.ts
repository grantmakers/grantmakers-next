/**
 * Temporary utility to troubleshoot the intermittent 500 error caused by "window is undefined"
 *
 * It attempts to capture component-level information
 * It then make an attempt to retry the request
 */
import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = async ({ error }) => {
  if (error instanceof ReferenceError && error.message === 'window is not defined') {
    console.error('Window Reference Error:', error.stack);
  }
  if (error) {
    console.log(error);
  }
  return {
    message: 'Internal Server Error',
  };
};
