import { ref } from 'vue'

const usePremios = () => {
  const isLoading = ref(true)

  return {
    isLoading,
  }
}

export default usePremios
