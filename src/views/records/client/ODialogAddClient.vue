<script setup lang="ts">
import type { VForm } from "vuetify/components/VForm";

interface Emit {
  (e: "update:modelValue", value: boolean): void;
}

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const isFormValid = ref(false);
const loading = ref(false);
const refForm = ref<VForm>();
const cpfCnpj = ref(new CpfCnpj(""));
const selectedTipoPessoa: Ref<"F" | "J" | null> = ref(null);
const tipoPessoaOptions = [
  { datacy: "radioClientePF", nome: "Pessoa física", id: "F" },
  { datacy: "radioClientePJ", nome: "Pessoa jurídica", id: "J" },
];

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit("update:modelValue", false);

  nextTick(() => {
    cpfCnpj.value.valor = "";
    selectedTipoPessoa.value = null;
    refForm.value?.resetValidation();
  });
};

const onSubmit = () => {
  refForm.value
    ?.validate()
    .then(({ valid }) => {
      loading.value = true;
      if (valid && selectedTipoPessoa.value) {
        // 👉 TODO: integrar
        emit("update:modelValue", false);
        nextTick(() => {
          cpfCnpj.value.valor = "";
          selectedTipoPessoa.value = null;
          refForm.value?.resetValidation();
        });
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit("update:modelValue", val);
};

// Watchs
watch(
  () => cpfCnpj.value.valor,
  (value) => {
    if (cpfCnpj.value.tipo === "CPF") {
      selectedTipoPessoa.value = "F";
    } else if (cpfCnpj.value.tipo === "CNPJ") {
      selectedTipoPessoa.value = "J";
    } else {
      selectedTipoPessoa.value = null;
    }
  }
);
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
              <OLabel for="addCliente-cpfCnpj" required>
                <span
                  :class="{
                    'font-weight-bold': cpfCnpj.tipo == 'CPF',
                  }"
                  >CPF</span
                >/<span
                  :class="{
                    'font-weight-bold': cpfCnpj.tipo == 'CNPJ',
                  }"
                  >CNPJ</span
                >
              </OLabel>
              <AppTextField
                id="addCliente-cpfCnpj"
                data-cy="cmpAddCPFCNPJ"
                v-model="cpfCnpj.valor"
                :rules="[requiredValidator, cpfCnpj.ehValido]"
              />
            </VCol>
            <!-- 👉 Tipo Pessoa: F | J -->
            <VCol cols="12">
              <VRadioGroup v-model="selectedTipoPessoa" inline disabled>
                <div>
                  <VRadio
                    v-for="option in tipoPessoaOptions"
                    :key="option.id"
                    :label="option.nome"
                    :value="option.id"
                  />
                </div>
              </VRadioGroup>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <!-- 👉 Salvar and Cancelar -->
          <VBtn
            data-cy="btnCancelarNovo"
            type="reset"
            variant="outlined"
            color="secondary"
            class="me-3"
            :disabled="loading"
            @click="closeNavigationDrawer"
          >
            Cancelar
          </VBtn>
          <VBtn type="submit" data-cy="btnSalvarNovo" :loading="loading">
            Salvar
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
