<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  options: {
    type: Object,
    threshold: Number,
  },
});

const emit = defineEmits(['intersect']);
const root = ref(null);
const observer = ref(null);

const handleIntersection = (entry) => {
  if (entry && entry.isIntersecting) {

    emit('intersect');
  }
};

onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    handleIntersection(entry);
  },
  {
    treshold: props.options.treshold
  }
  );

  observer.value.observe(root.value);
});

onUnmounted(() => {
  observer.value.disconnect();
});

</script>

<template>
  <div ref="root" ></div>
</template>