<script lang="ts" setup>
import type { PersonalData } from "./types";

const props = defineProps<{
  formData: PersonalData;
}>();

const emit = defineEmits<{
  (e: "update:formData", value: PersonalData): void;
}>();

const formData = ref<PersonalData>(props.formData);

watch(formData, () => {
  emit("update:formData", formData.value);
});
</script>
<template>
  <VForm>
    <VRow>
      <VCol cols="12" sm="6" md="4" lg="3">
        <OLabel for="client-cpf-cnpj" required>
          <span
            :class="{
              'font-weight-bold': formData.cpfCnpj.tipo == 'CPF',
            }"
          >
            CPF
          </span>
          /
          <span
            :class="{
              'font-weight-bold': formData.cpfCnpj.tipo == 'CNPJ',
            }"
          >
            CNPJ
          </span>
        </OLabel>
        <AppTextField
          id="client-cpf-cnpj"
          v-model="formData.cpfCnpj.valor"
          :rules="[requiredValidator, formData.cpfCnpj.ehValido]"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <OLabel for="client-name" required>Nome</OLabel>
        <AppTextField
          id="client-name"
          v-model="formData.name"
          placeholder="John Doe"
          :rules="[requiredValidator]"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <OLabel for="client-code">Código</OLabel>
        <AppTextField
          id="client-code"
          v-model="formData.code"
          placeholder="C001"
        />
      </VCol>
    </VRow>
  </VForm>
</template>
