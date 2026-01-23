<script lang="ts">
  import chatgptIcon from '$lib/assets/images/chatgpt.svg';
  import claudeIcon from '$lib/assets/images/claude.svg';

  interface Props {
    aiSummary: string;
    aiSummarySource: 'chatgpt' | 'claude';
  }

  let { aiSummarySource }: Props = $props();

  const aiImgDetails = {
    chatgpt: { src: chatgptIcon, width: 280, height: 54, maxHeightClass: 'max-h-6' },
    claude: { src: claudeIcon, width: 280, height: 54, maxHeightClass: 'max-h-6' },
  };

  let sourceName = $derived(aiSummarySource?.startsWith('chatgpt') ? 'chatgpt' : 'claude');
  let currentAiIconDetails = $derived(aiImgDetails[sourceName]);
</script>
