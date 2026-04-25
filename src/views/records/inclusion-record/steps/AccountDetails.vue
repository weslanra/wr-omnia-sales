<script setup lang="ts">
import type { AccountDetails } from "./types";

const props = defineProps<{
  formData: AccountDetails;
}>();

const emit = defineEmits<{
  (e: "update:formData", value: AccountDetails): void;
}>();

const idPrefix = "account-details";
const formData = ref<AccountDetails>(props.formData);

watch(formData, () => {
  emit("update:formData", formData.value);
});
</script>

<template>
  <VForm>
    <VRow>
      <VCol cols="12">
        <OLabel :for="`${idPrefix}-name`" required>Nome</OLabel>
        <AppTextField
          :id="`${idPrefix}-name`"
          v-model="formData.name"
          placeholder="John Doe"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol cols="12" sm="6">
        <OLabel :for="`${idPrefix}-cnpj`" required>CNPJ</OLabel>
        <AppTextField
          :id="`${idPrefix}-cnpj`"
          v-model="formData.cnpj"
          placeholder="00.000.000/0000-00"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol cols="12" sm="6">
        <OLabel :for="`${idPrefix}-phone`" required>Celular</OLabel>
        <AppTextField
          :id="`${idPrefix}-phone`"
          v-model="formData.phone"
          placeholder="Número com DDD"
          :rules="[requiredValidator]"
        />
      </VCol>

      <VCol cols="12">
        <h6 class="text-h6 mb-2">
          Gostaria de receber notificações e dicas do sistema?
        </h6>

        <div class="d-flex align-center flex-wrap text-body-2 gap-x-3">
          <VCheckbox v-model="formData.notification.email">
            <template #label>
              <span class="text-body-1">Email</span>
            </template>
          </VCheckbox>
          <VCheckbox v-model="formData.notification.whatsapp">
            <template #label>
              <span class="text-body-1">WhatsApp</span>
            </template>
          </VCheckbox>
          <VCheckbox
            v-model="formData.notification.pushNotification"
          >
            <template #label>
              <span class="text-body-1">Notificação</span>
            </template>
          </VCheckbox>
        </div>
      </VCol>
    </VRow>
  </VForm>
</template>
