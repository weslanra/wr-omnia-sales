<script setup lang="ts">
import AdditionalDataStep from "@/views/records/client/steps/AdditionalDataStep.vue";
import AddressStep from "@/views/records/client/steps/AddressStep.vue";
import ContactStep from "@/views/records/client/steps/ContactStep.vue";
import PersonalDataStep from "@/views/records/client/steps/PersonalDataStep.vue";
import { ClienteData } from "@/views/records/client/steps/types";

const route = useRoute("records-client-view-id");
const id = parseInt(route.params.id);

const createDealSteps = [
  {
    title: "Dados pessoais",
    subtitle: "",
    icon: "tabler-user",
  },
  {
    title: "Endereço",
    subtitle: "",
    icon: "tabler-map-pin",
  },
  {
    title: "Contato",
    subtitle: "",
    icon: "tabler-address-book",
  },
  {
    title: "Dados adicionais",
    subtitle: "",
    icon: "tabler-tag",
  },
];

const currentStep = ref(0);

const clientData = ref<ClienteData>({
  personalData: {
    cpfCnpj: new CpfCnpj(""),
    name: "",
    code: "",
  },
  addressData: {
    cep: "",
    uf: "",
    city: null,
  },
  contact: {
    phone: "",
    mail: "",
    contacts: [],
  },
  additionalData: {
    type: "",
    status: "",
    avatar: "",
  },
});

const onSubmit = () => {
  console.log("clientData :>> ", clientData.value);
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
              <PersonalDataStep v-model:form-data="clientData.personalData" />
            </VWindowItem>

            <VWindowItem>
              <AddressStep v-model:form-data="clientData.addressData" />
            </VWindowItem>

            <VWindowItem>
              <ContactStep v-model:form-data="clientData.contact" />
            </VWindowItem>

            <VWindowItem>
              <AdditionalDataStep
                v-model:form-data="clientData.additionalData"
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
