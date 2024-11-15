<script lang="ts">
  import chatgptIcon from '$lib/assets/images/chatgpt.svg';
  import claudeIcon from '$lib/assets/images/claude.svg';

  interface Props {
    aiSummary: string;
    aiSummarySource: 'chatgpt' | 'claude';
  }

  let { aiSummary, aiSummarySource }: Props = $props();

  const aiImgDetails = {
    chatgpt: { src: chatgptIcon, width: 280, height: 54, maxHeightClass: 'max-h-6' },
    claude: { src: claudeIcon, width: 280, height: 54, maxHeightClass: 'max-h-6' },
  };

  let sourceName: 'chatgpt' | 'claude';
  let currentAiIconDetails: { src: string; width: number; height: number; maxHeightClass: string };

  function isAiImgDetailsKey(key: string): key is keyof typeof aiImgDetails {
    return key === 'chatgpt' || key === 'claude';
  }

  sourceName = aiSummarySource?.startsWith('chatgpt') ? 'chatgpt' : 'claude';
  if (isAiImgDetailsKey(sourceName)) {
    currentAiIconDetails = aiImgDetails[sourceName];
  }
</script>
