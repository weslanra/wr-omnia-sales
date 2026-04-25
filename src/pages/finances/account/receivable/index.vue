<script setup lang="ts">
const searchQuery = ref("");
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
  { title: "Cliente", key: "clienteNome" },
  { title: "Forma de pagamento", key: "formaPagamento" },
  { title: "Vencimento", key: "vencimento" },
  { title: "Valor", key: "valor" },
  { title: "Situação", key: "situacao" },
  { title: "Ações", key: "actions", sortable: false },
];

const items = ref([
  {
    id: 1,
    clienteNome: "Cliente A",
    formaPagamento: "Boleto",
    vencimento: "2023-10-01",
    valor: "R$ 100,00",
    situacao: "Pendente",
  },
  {
    id: 2,
    clienteNome: "Cliente B",
    formaPagamento: "Cartão de Crédito",
    vencimento: "2023-10-05",
    valor: "R$ 200,00",
    situacao: "Pago",
  },
  {
    id: 3,
    clienteNome: "Cliente C",
    formaPagamento: "Transferência",
    vencimento: "2023-10-10",
    valor: "R$ 300,00",
    situacao: "Atrasado",
  },
]);
const totalItems = computed(() => items.value.length);

const computedMoreList = computed(() => {
  return (paramId: number) => [
    { title: "Download", value: "download", prependIcon: "tabler-download" },
    {
      title: "Edit",
      value: "edit",
      prependIcon: "tabler-pencil",
      to: { name: "apps-invoice-edit-id", params: { id: paramId } },
    },
    {
      title: "Duplicate",
      value: "duplicate",
      prependIcon: "tabler-layers-intersect",
    },
  ];
});

// 👉 Delete Account Receivable
const deleteAccountReceivable = async (ids: number[]) => {
  console.log("Delete", ids);
};
</script>

<template>
  <OPageTitle class="pb-4" title="Contas a receber" />
  <section v-if="items">
    <VCard id="accounts-receivable-list">
      <VCardText
        class="d-flex justify-space-between align-center flex-wrap gap-4"
      >
        <div class="d-flex gap-4 align-center flex-wrap">
          <div class="d-flex align-center gap-2">
            <span>Exibir</span>
            <AppSelect
              :model-value="itemsPerPage"
              :items="[
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' },
                { value: -1, title: 'All' },
              ]"
              style="inline-size: 5.5rem"
              @update:model-value="itemsPerPage = parseInt($event, 10)"
            />
          </div>
          <!-- 👉 Adicionar -->
          <VBtn prepend-icon="tabler-plus" :to="{ name: 'apps-invoice-add' }">
            Adicionar
          </VBtn>
        </div>

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div style="inline-size: 15.625rem">
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
        :items-length="totalItems"
        :headers="headers"
        :items="items"
        item-value="id"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn
            :to="{ name: 'apps-invoice-preview-id', params: { id: item.id } }"
          >
            <VIcon icon="tabler-eye" />
          </IconBtn>

          <IconBtn @click="deleteAccountReceivable([item.id])">
            <VIcon icon="tabler-trash" />
          </IconBtn>

          <MoreBtn
            :menu-list="computedMoreList(item.id)"
            item-props
            color="undefined"
          />
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalItems"
          />
        </template>
      </VDataTableServer>
      <!-- !SECTION -->
    </VCard>
  </section>
  <section v-else>
    <VCard>
      <VCardTitle>Nenhum item cadastrado</VCardTitle>
    </VCard>
  </section>
</template>
