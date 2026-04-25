<script lang="ts" setup>
import type { AddressData } from "./types";

const props = defineProps<{
  formData: AddressData;
}>();

const emit = defineEmits<{
  (e: "update:formData", value: AddressData): void;
}>();

const formData = ref<AddressData>(props.formData);

watch(formData, () => {
  emit("update:formData", formData.value);
});
</script>
<template>
  <VForm>
    <VRow>
      <VCol cols="12" sm="6" md="4" lg="3">
        <OLabel for="client-cep" required> CEP </OLabel>
        <AppTextField
          id="client-cep"
          v-model="formData.cep"
          :rules="[requiredValidator]"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <OLabel for="client-uf" required>UF</OLabel>
        <AppTextField
          id="client-uf"
          v-model="formData.uf"
          placeholder="Sergipe"
          :rules="[requiredValidator]"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <OLabel for="client-city" required>Cidade</OLabel>
        <AppTextField
          id="client-city"
          v-model="formData.city"
          placeholder="Aracaju"
          :rules="[requiredValidator]"
        />
      </VCol>
    </VRow>
  </VForm>
</template>
