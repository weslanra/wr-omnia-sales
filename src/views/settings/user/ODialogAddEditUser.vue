<script setup lang="ts">
import type { VForm } from "vuetify/components/VForm";

interface Props {
  modelValue: boolean;
}

interface Emit {
  (e: "update:modelValue", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const isFormValid = ref(false);
const loading = ref(false);
const name = ref("");
const refForm = ref<VForm>();

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit("update:modelValue", false);
};

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit("update:modelValue", val);
};

const onSubmit = () => {
  refForm.value
    ?.validate()
    .then(({ valid }) => {
      loading.value = true;
      if (valid) {
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
<template>
  <VDialog
    v-model="props.modelValue"
    @update:model-value="handleDrawerModelValueUpdate"
    max-width="600"
    :persistent="loading"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeNavigationDrawer" :disabled="loading" />

    <!-- Dialog Content -->
    <VCard title="Adicionar Cliente">
      <!-- 👉 Form -->
      <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
        <VCardText>
          <VRow>
            <!-- 👉 CPF/Cnpj -->
            <VCol cols="12">
              <OLabel for="user-name" title="Nome" required />
              <AppTextField
                id="user-name"
                v-model="name"
                :rules="[requiredValidator]"
              />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <!-- 👉 Salvar and Cancelar -->
          <VBtn
            type="reset"
            variant="outlined"
            color="secondary"
            class="me-3"
            :disabled="loading"
            @click="closeNavigationDrawer"
          >
            Cancelar
          </VBtn>
          <VBtn type="submit" :loading="loading"> Salvar </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
