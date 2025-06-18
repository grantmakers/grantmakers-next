/**
 * Fetches all zip files for e-filed 990s available on IRS.gov
 *
 * The only zip files currently on the target IRS page are the 990 XML zip files
 * The function ensures only <a> elements with an href containing a zip file are returned
 *
 * Could further narrow the target to the accordion of e-filings via elements = $('#accordion1639415792708 a'), but seems fragile given the ID format of a random string
 *
 * Usage
 * From ETL root
 * npx tsx --env-file=.env.local ./src/downloaders/irsZips/index.ts
 */

import os from 'os';
import path from 'path';
import { mkdir } from 'fs/promises';
import * as cheerio from 'cheerio';
import { log } from '@repo/shared/utils/logger';
import { downloadWebStream } from '@repo/shared/utils/downloadWebStream';
import { filingZipUrls } from '@repo/shared/constants/updates';

const irs: string = 'https://www.irs.gov/charities-non-profits/form-990-series-downloads';

const homeDir = os.homedir();
const projectDir = process.env.FILINGS_ROOT;
const targetDir = 'zipped/updates';

if (!projectDir) {
  throw new Error('Missing path variables');
}
const downloadDir = path.join(homeDir, projectDir, targetDir);

const ensureDirectoryExistence = async (filePath: string) => {
  await mkdir(downloadDir, { recursive: true });
};

console.log('Downloading zip files to: ', downloadDir);

const findNewUrls = (oldUrls: string[], newUrls: string[]) => {
  return newUrls.filter((url) => !oldUrls.includes(url));
};

async function main() {
  try {
    const response = await fetch(irs);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const body = await response.text();
    const $ = cheerio.load(body);
    const elements: any = $('a');

    const urls = getUrls(elements);
    const count = urls.length;
    log(`\nTotal Link Count: ${count}`);

    // Limit urls to just updates, when required
    const newUrls = findNewUrls(filingZipUrls, urls);
    log(`New Links: ${newUrls.length}`);

    // Download files
    // TODO Add progress bar
    await ensureDirectoryExistence(downloadDir);

    const fileStreams = await Promise.all(
      newUrls.map((url) => {
        const filename = path.basename(url);
        const filepath = path.join(downloadDir, filename);
        log(`\nDownloading ${url}\nto ${filepath}`);
        return downloadWebStream(url, filepath);
      }),
    );
    return fileStreams;
  } catch (err) {
    console.error(err);
  }
}

function getUrls(elements: any): string[] {
  const urls: string[] = [];

  elements.filter(filterChecks).each((i: number, link: any) => {
    if (!link) {
      throw new Error('Malformed links');
    }
    const url: string = link.attribs.href;
    if (url.includes('index')) {
      log(`\nSkipping an index file: ${link.attribs.href}\n`);
      return false;
    }
    urls.push(url);
  });

  return urls;
}

function filterChecks(i: number, link: any): boolean {
  // Skip if there is no href attribute.
  if (typeof link.attribs.href === 'undefined') return false;

  // Skip any links to Index files.
  if (link.attribs.href.includes('index')) return false;

  // Return only if it's a zip file
  return link.attribs.href.includes('.zip');
}

main().catch(console.error);
