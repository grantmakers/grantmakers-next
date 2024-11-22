import { writeFile } from 'node:fs/promises';

async function checkUrl(url) {
  try {
    await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    });
    return { url, working: true };
  } catch {
    return { url, working: false };
  }
}

async function main() {
  const urls = [
    'http://youthexplosion4christ.com/',
    'https://youthexplosion4christ.com/',
    // Your URLs here
  ];

  const results = await Promise.all(urls.map(checkUrl));

  const deadLinks = results.filter((r) => !r.working).map((r) => r.url);

  // await writeFile('dead-links.json', JSON.stringify(deadLinks, null, 2));
  console.log(`Found ${deadLinks.length} dead links`);
  console.log(JSON.stringify(deadLinks));
}

main().catch((error) => {
  console.error(error);
});
