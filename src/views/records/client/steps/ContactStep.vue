<script lang="ts" setup>
import type { Contact } from "./types";

const props = defineProps<{
  formData: Contact;
}>();

const emit = defineEmits<{
  (e: "update:formData", value: Contact): void;
}>();

const formData = ref<Contact>(props.formData);

watch(formData, () => {
  emit("update:formData", formData.value);
});
</script>
<template>
  <VForm>
    <VRow>
      <VCol cols="12" sm="6" md="4" lg="3">
        <OLabel for="client-phone" required> Celular </OLabel>
        <AppTextField
          id="client-phone"
          v-model="formData.phone"
          :rules="[requiredValidator]"
          placeholder="(11) 99999-9999"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <OLabel for="client-mail" required>E-mail</OLabel>
        <AppTextField
          id="client-mail"
          v-model="formData.mail"
          placeholder="example@mail.com"
          :rules="[requiredValidator]"
        />
      </VCol>
      <VCol cols="12" sm="6" md="4" lg="3">
        <OLabel for="client-city">Contatos</OLabel>
        <AppTextField
          id="client-city"
          v-model="formData.contacts"
          placeholder="Aracaju"
        />
      </VCol>
    </VRow>
  </VForm>
</template>
