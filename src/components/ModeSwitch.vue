<script setup>
defineProps({
  mode: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['change'])
</script>

<template>
  <div class="mode-switch">
    <button
      class="mode-switch__btn"
      :class="{ 'is-active': mode === '2d' }"
      @click="emit('change', '2d')"
    >
      二维山河
    </button>
    <button
      class="mode-switch__btn"
      :class="{ 'is-active': mode === '3d' }"
      @click="emit('change', '3d')"
    >
      立体山河
    </button>
  </div>
</template>
