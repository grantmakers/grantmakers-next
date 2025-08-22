export const log = (message: string | unknown, data?: unknown) => {
  if (data) {
    console.log(`${message}`, data);
  } else {
    console.log(`${message}`);
  }
};
