<script lang="ts">
  /**
   * This is a placeholder implementation of a Primary Nav dropdown
   * It uses the commercial TailwindPlus UIBlocks navigation/header templates for inspiration
   * It is intended to be used with Tailwind Element
   *
   * TODO Decide when/where to import Tailwind Elements
   */
</script>

<!-- Profile dropdown -->
<!-- FEAT: Future preferences -->
<el-dropdown class="relative ml-4 flex flex-auto shrink-0 items-center">
  <button type="button" class="relative flex rounded-full bg-white text-sm ring-2 ring-white/20 focus:outline-none focus:ring-white">
    <span class="absolute -inset-1.5"></span>
    <span class="sr-only">Open user menu</span>

    <div class="relative h-8 w-8 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-600">
      <svg class="absolute -left-1 h-10 w-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
        ><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg
      >
    </div>
  </button>

  <el-menu
    anchor="bottom end"
    popover
    class="m-0 ml-2 w-48 origin-top-right rounded-md bg-white p-0 py-1 shadow-lg outline outline-1 outline-black/5 [--anchor-gap:theme(spacing.2)] data-[closed]:data-[leave]:scale-95 data-[closed]:data-[leave]:transform data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-75 data-[leave]:ease-in dark:bg-gray-800 dark:-outline-offset-1 dark:outline-white/10"
  >
    <a
      href="#profile"
      class="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:focus:bg-white/5"
      >Recent Searches</a
    >
    <a
      href="#settings"
      class="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:focus:bg-white/5"
      >Watchlist</a
    >
  </el-menu>
</el-dropdown>
