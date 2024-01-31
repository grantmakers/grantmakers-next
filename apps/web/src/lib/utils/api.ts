export let WORKER_URL: string;
export let PROFILES_API_ENDPOINT: string;
export let AUTH_PRIVATE_KEY: string;

const getEnvVariable = (key: string): string => {
  const value = import.meta.env[key];
  if (typeof value === 'undefined' || value === null) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const initEnvironmentVariables = async (): Promise<void> => {
  try {
    WORKER_URL = getEnvVariable('WORKER_URL');
    PROFILES_API_ENDPOINT = getEnvVariable('PROFILES_API_ENDPOINT');
    AUTH_PRIVATE_KEY = getEnvVariable('AUTH_PRIVATE_KEY');
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Missing environment variable(s). Unable to proceed.');

      // Handle the error appropriately
      // This could be showing a message to the user, logging the error, etc.
    }
  }
};
