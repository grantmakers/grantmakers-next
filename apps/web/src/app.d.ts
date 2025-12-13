import type { R2Bucket } from '@cloudflare/workers-types';
import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageState {}
    interface Platform {
      env?: {
        R2_V1_POC0: R2Bucket;
      };
    }
    interface PageData {
      profile?: GrantmakersExtractedDataObj;
    }
  }
}

export {};
