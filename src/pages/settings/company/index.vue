<script setup lang="ts">
import { Company, PaymentStatus } from "@db/companies/types";

const searchQuery = ref("");
const selectedStates = ref<number[] | null>(null);
const selectedPaymentStatus = ref<PaymentStatus | null>(null);
const selectedActive = ref<boolean | null>(null);
const selectedRows = ref<string[]>([]);

// Data table options
const itemsPerPage = ref(10);
const page = ref(1);
const sortBy = ref();
const orderBy = ref();

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key;
  orderBy.value = options.sortBy[0]?.order;
};

// 👉 headers
const headers = [
  { title: "CNPJ", key: "cnpj", sortable: false },
  { title: "Razão social", key: "companyName" },
  // Incluir logo + nome fantasia + email nessa coluna
  { title: "Nome fantasia", key: "fantasyName" },
  { title: "Contato", key: "contact" },
  { title: "Cidade/UF", key: "address" },
  { title: "Sit. financeira", key: "paymentStatus" },
  { title: "Ativo", key: "active" },
  { title: "Actions", key: "actions", sortable: false },
];

// 👉 Fetch companies
const { data: companiesData, execute: fetchCompanies } = await useApi<any>(
  createUrl("/companies", {
    query: {
      q: searchQuery,
      page,
      itemsPerPage,
      sortBy,
      orderBy,
      // Custom filters
      paymentStatus: selectedPaymentStatus,
      active: selectedActive,
    },
  })
);

const companies = computed((): Company[] => companiesData.value.data);
const totalCompanies = computed(() => companiesData.value.total);

// 👉 Delete Company
const deleteCompany = async (id: number) => {
  await $api(`/companies/${id}`, { method: "DELETE" });

  fetchCompanies();
};
</script>

<template>
  <section v-if="companies">
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Filtros</VCardTitle>
      </VCardItem>

      <VCardText>
        <VRow>
          <!-- 👉 Select state -->
          <VCol cols="12" md="4" lg="3">
            <div class="filter-state">
              <AppSelect
                v-model="selectedStates"
                placeholder="Estado"
                clearable
                clear-icon="tabler-x"
                single-line
                multiple
                :items="[
                  { title: 'SP', value: 1 },
                  { title: 'RJ', value: 2 },
                ]"
              />
            </div>
          </VCol>

          <!-- 👉 Select payment status -->
          <VCol cols="12" md="4" lg="3">
            <div class="filter-payment-status">
              <AppSelect
                v-model="selectedPaymentStatus"
                placeholder="Situação financeira"
                clearable
                clear-icon="tabler-x"
                single-line
                :items="[
                  { title: 'Adimplente', value: 'compliant' },
                  { title: 'Inadimplente', value: 'non-compliant' },
                ]"
              />
            </div>
          </VCol>
          <!-- 👉 Select active -->
          <VCol cols="12" md="4" lg="3">
            <div class="filter-active">
              <AppSelect
                v-model="selectedActive"
                placeholder="Ativo"
                clearable
                clear-icon="tabler-x"
                single-line
                :items="[
                  { title: 'Sim', value: true },
                  { title: 'Não', value: false },
                ]"
              />
            </div>
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardText
        class="d-flex justify-space-between align-center flex-wrap gap-4"
      >
        <div class="d-flex gap-4 align-center flex-wrap">
          <div class="d-flex align-center gap-2">
            <span>Exibir</span>
            <AppSelect
              class="filter-per-page"
              :model-value="itemsPerPage"
              :items="[
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' },
                { value: -1, title: 'All' },
              ]"
              @update:model-value="itemsPerPage = parseInt($event, 10)"
            />
          </div>
          <!-- 👉 Adicionar -->
          <VBtn prepend-icon="tabler-plus" :to="{ name: 'apps-invoice-add' }">
            Adicionar
          </VBtn>
        </div>

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="list-filter">
            <AppTextField v-model="searchQuery" placeholder="Buscar" />
          </div>
        </div>
      </VCardText>
      <VDivider />

      <!-- SECTION Datatable -->
      <VDataTableServer
        v-model="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        show-select
        :items-length="totalCompanies"
        :headers="headers"
        :items="companies"
        item-value="id"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- Active -->
        <template #item.address="{ item }">
          {{ `${item.address.city.name}/${item.address.state.abbreviation}` }}
        </template>

        <!-- Active -->
        <template #item.paymentStatus="{ item }">
          {{
            item.paymentStatus === "compliant" ? "Adimplente" : "Inadimplente"
          }}
        </template>

        <!-- Active -->
        <template #item.active="{ item }">
          {{ item.active ? "Sim" : "Não" }}
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn
            :to="{ name: 'settings-company-view-id', params: { id: item.id } }"
          >
            <VIcon icon="tabler-pencil" />
          </IconBtn>
          <IconBtn @click="deleteCompany(item.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalCompanies"
          />
        </template>
      </VDataTableServer>
      <!-- !SECTION -->
    </VCard>
  </section>
  <section v-else>
    <VCard>
      <VCardTitle>Nenhuma registro cadastrado</VCardTitle>
    </VCard>
  </section>
</template>

<style lang="scss">
.filter-per-page {
  inline-size: 5.5rem;
}

.list-filter {
  inline-size: 15.625rem;
}
</style>
