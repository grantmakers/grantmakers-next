/**
 * Streams a remote file to local directory
 *
 * Leverages the newer Node Web Stream API
 * Note: The Web Stream API in Node v20 was experimental
 * Node v20 was LTS at the time this function was written
 * Web Streams API is stable in Node v21+
 *
 * TODO Enhancement...
 * Add progress bars via cli-progress: https://www.npmjs.com/package/cli-progress
 *
 */
import fs from 'fs';
import { dirname } from 'path';
import { WritableStream } from 'node:stream/web';
import { finished } from 'stream/promises';

export async function downloadWebStream(url: string, filePath: string) {
  try {
    // Throw explicit error if filePath directory does not exist
    const dir = dirname(filePath);
    if (!fs.existsSync(dir)) {
      throw new Error(`Directory does not exist: ${dir}`);
    }

    const downloadWriteStream = fs.createWriteStream(filePath);

    const stream = new WritableStream({
      write(chunk) {
        downloadWriteStream.write(chunk);
      },
      async close() {
        downloadWriteStream.end();
      },
    });

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }
    const body = response.body;
    await body.pipeTo(stream).catch(console.error);
    await finished(downloadWriteStream);
    console.log(`File downloaded successfully to ${filePath}`);
  } catch (error) {
    console.log(`Error downloading ${url} to ${filePath}`, error);
    throw new Error(`Error in downloadWebStream`);
  }
}
