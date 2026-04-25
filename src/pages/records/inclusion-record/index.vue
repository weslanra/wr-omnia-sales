<script setup lang="ts">
import AccountDetails from "@/views/records/inclusion-record/steps/AccountDetails.vue";
import ChooseSubscription from "@/views/records/inclusion-record/steps/ChooseSubscription.vue";

import type { InclusionRecordData } from "@/views/records/inclusion-record/steps/types";

const createDealSteps = [
  {
    title: "Detalhes da conta",
    subtitle: "Configurar detalhes da conta",
    icon: "tabler-users",
  },
  {
    title: "Planos",
    subtitle: "Escolha um plano para iniciar o teste",
    icon: "tabler-checkbox",
  },
];

const currentStep = ref(0);

const inclusionRecordData = ref<InclusionRecordData>({
  accountDetails: {
    name: "",
    cnpj: "",
    phone: "",
    notification: {
      email: true,
      whatsapp: true,
      pushNotification: true,
    },
  },
  dealType: {
    Offer: "percentage",
    discount: null,
    region: null,
  },
});

const onSubmit = () => {
  console.log("inclusionRecordData :>> ", inclusionRecordData.value);
};
</script>

<template>
  <VCard>
    <VRow no-gutters>
      <VCol
        cols="12"
        md="4"
        lg="3"
        :class="$vuetify.display.mdAndUp ? 'border-e' : 'border-b'"
      >
        <VCardText>
          <AppStepper
            v-model:current-step="currentStep"
            direction="vertical"
            :items="createDealSteps"
            icon-size="22"
            class="stepper-icon-step-bg"
          />
        </VCardText>
      </VCol>

      <VCol cols="12" md="8" lg="9">
        <VCardText>
          <VWindow v-model="currentStep" class="disable-tab-transition">
            <VWindowItem>
              <AccountDetails
                v-model:form-data="inclusionRecordData.accountDetails"
              />
            </VWindowItem>

            <VWindowItem>
              <ChooseSubscription
                v-model:form-data="inclusionRecordData.dealType"
              />
            </VWindowItem>
          </VWindow>

          <div class="d-flex flex-wrap gap-4 justify-space-between mt-6">
            <VBtn
              color="secondary"
              variant="tonal"
              :disabled="currentStep === 0"
              @click="currentStep--"
            >
              <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
              Previous
            </VBtn>

            <VBtn
              v-if="createDealSteps.length - 1 === currentStep"
              color="success"
              @click="onSubmit"
            >
              submit
            </VBtn>

            <VBtn v-else @click="currentStep++">
              Next

              <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
            </VBtn>
          </div>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>
