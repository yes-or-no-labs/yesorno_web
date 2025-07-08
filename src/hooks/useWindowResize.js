import { ref, onMounted, onUnmounted } from 'vue';

export function useWindowResize() {
  const width = ref(window.innerWidth);

  const handleResize = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return { width };
}