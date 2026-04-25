<script lang="ts" setup>
import type { AdditionalData } from "./types";

const props = defineProps<{
  formData: AdditionalData;
}>();

const emit = defineEmits<{
  (e: "update:formData", value: AdditionalData): void;
}>();

const formData = ref<AdditionalData>(props.formData);

watch(formData, () => {
  emit("update:formData", formData.value);
});
</script>
<template>
  <VForm>
    <VRow>
      <VCol cols="12" sm="6" md="4" lg="3">
        <OLabel for="client-type"> Tipo de contato </OLabel>
        <AppTextField
          id="client-type"
          v-model="formData.type"
          placeholder="Cliente"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <OLabel for="client-status" required>Situação</OLabel>
        <AppTextField
          id="client-status"
          v-model="formData.status"
          :rules="[requiredValidator]"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <OLabel for="client-avatar">Avatar</OLabel>
        <AppTextField id="client-avatar" v-model="formData.avatar" />
      </VCol>
    </VRow>
  </VForm>
</template>
