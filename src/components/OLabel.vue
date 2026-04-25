<script lang="ts" setup>
interface Props {
  title?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  required: false,
  exibirObrigatoriedade: true,
});
</script>

<template>
  <label>
    <template v-if="$slots.default">
      <slot></slot>
    </template>
    <template v-else>
      {{ props.title }}
    </template>
    <span v-if="props.required"> * </span>
    <span v-else> (opcional) </span>
  </label>
</template>
