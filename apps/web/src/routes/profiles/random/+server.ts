import type { RequestHandler } from '@sveltejs/kit';
import data from '@repo/shared/data/public/ein.json';

export const prerender = true;

type Data = number[];

const einArray: Data = data;

// EINs are currently stored as an array of numbers for memory optimization purposes
// Some EINs start with a leading zero, so we need to handle those
// Note: There are no valid EINs that start with two zeroes per IRS rules
function padEIN(ein: number): string {
  return ein.toString().padStart(9, '0');
}

export const GET: RequestHandler = async () => {
  const randomIndex = Math.floor(Math.random() * einArray.length);
  const ein = einArray[randomIndex];
  const paddedEIN = padEIN(ein);

  return new Response(null, {
    status: 307,
    headers: {
      Location: `/profiles/v0/${paddedEIN}`,
    },
  });
};
