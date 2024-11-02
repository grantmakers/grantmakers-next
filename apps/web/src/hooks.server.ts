/**
 * Temporary utility to troubleshoot the intermittent 500 error caused by "window is undefined"
 *
 * It attempts to capture component-level information
 * It then make an attempt to retry the request
 */
import type { HandleServerError } from '@sveltejs/kit';

const retryAttempts = new Map<string, number>();
const MAX_RETRIES = 3;

function extractComponentInfo(stack: string | undefined): string {
  if (!stack) return 'unknown';
  const componentMatch = stack.match(/\((.*\.svelte):\d+:\d+\)/);
  return componentMatch ? componentMatch[1] : 'unknown';
}

export const handleError: HandleServerError = async ({ error, event }) => {
  const requestId = event.request.headers.get('x-request-id') || crypto.randomUUID();
  const currentAttempts = retryAttempts.get(requestId) || 0;

  if (error instanceof ReferenceError && error.message === 'window is not defined') {
    console.error('Window Reference Error:', {
      component: extractComponentInfo(error.stack),
      attempt: currentAttempts + 1,
      route: event.route.id,
    });

    if (currentAttempts < MAX_RETRIES) {
      retryAttempts.set(requestId, currentAttempts + 1);
      await new Promise((resolve) => setTimeout(resolve, 100 * (currentAttempts + 1)));

      try {
        const response = await event.fetch(event.request);
        if (response.ok) {
          return {
            message: 'Recovered from window not defined error',
          };
        }
      } catch (retryError: unknown) {
        if (retryError instanceof Error) {
          console.error('Retry failed:', {
            component: extractComponentInfo(retryError.stack),
            error: retryError.message,
          });
        } else {
          console.error('Retry failed with unknown error type');
        }
      }
    }
  }

  // Clean up
  retryAttempts.delete(requestId);
  return {
    message: 'Internal Server Error',
  };
};

// Clean up map periodically
setInterval(
  () => {
    retryAttempts.clear();
  },
  1000 * 60 * 5,
);
