<script lang="ts">
  interface Props {
    letter: string;
    size: 'sm' | 'md' | 'lg';
    classes?: string;
  }

  let { letter, size, classes }: Props = $props();

  const sizes = {
    sm: 'h-8 w-8 text-xl',
    md: 'h-12 w-12 text-2xl',
    lg: 'size-12 text-xl md:size-16 md:text-4xl',
  };

  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-slate-500',
    'bg-cyan-500',
    'bg-lime-500',
  ];

  const colorIndex = letter.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];
</script>

<div class={`${sizes[size]} ${bgColor} md:shadow-soft-sm flex items-center justify-center rounded-full font-thin text-white ${classes}`}>
  {letter.toUpperCase()}
</div>
