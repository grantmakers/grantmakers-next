<script lang="ts">
  interface Props {
    placeholderText?: string;
  }

  let { placeholderText = 'Foundation Quick Search...' }: Props = $props();
</script>

<button
  command="show-modal"
  commandfor="search-dialog-profiles-compact"
  type="button"
  title="Search"
  class="
    mx-auto flex w-full max-w-2xl items-center rounded-md
    border border-gray-300 bg-white p-2 text-left
    focus:outline-hidden focus:ring-2 focus:ring-indigo-500
  "
>
  <div class="aa-DetachedSearchButtonIcon cursor-pointer! text-slate-500!">
    <svg class="aa-SubmitIcon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path
        d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"
      ></path>
    </svg>
  </div>
  <span class="pl-6 text-slate-500">
    {placeholderText}
  </span>
</button>
