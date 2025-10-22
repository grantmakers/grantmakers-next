// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageState {}
    // interface Platform {}
    interface PageData {
      profile?: GrantmakersExtractedDataObj;
    }
  }
}

export {};
