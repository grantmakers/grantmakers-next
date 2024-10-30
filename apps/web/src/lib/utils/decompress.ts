export const decompressGzipAndParseJSON = async <T>(response: Response): Promise<T> => {
  const decompressionStream = new DecompressionStream('gzip');
  const decompressedStream = response.body?.pipeThrough(decompressionStream);
  const decompressedResponse = new Response(decompressedStream);
  const decompressedArrayBuffer = await decompressedResponse.arrayBuffer();
  const decodedString = new TextDecoder().decode(decompressedArrayBuffer);
  return JSON.parse(decodedString);
};
