<script setup lang="ts">

const searchQuery = ref('')
const selectedRows = ref<string[]>([])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// 👉 headers
const headers = [
  { title: 'Cód.', key: 'codigo' },
  { title: 'Nome', key: 'nome' },
  { title: 'CPF/CNPJ', key: 'cpfCnpj' },
  { title: 'Telefone', key: 'telefone' },
  { title: 'Ações', key: 'actions', sortable: false },
]

const items = ref([
  {
    id: 1,
    codigo: '001',
    nome: 'Fornecedor A',
    cpfCnpj: '123.456.789-00',
    telefone: '(11) 1234-5678',
  },
  {
    id: 2,
    codigo: '002',
    nome: 'Fornecedor B',
    cpfCnpj: '987.654.321-00',
    telefone: '(21) 8765-4321',
  },
  {
    id: 3,
    codigo: '003',
    nome: 'Fornecedor C',
    cpfCnpj: '456.789.123-00',
    telefone: '(31) 5678-1234',
  }
]);
const totalItems = computed(() => items.value.length)

const computedMoreList = computed(() => {
  return (paramId: number) => ([
    { title: 'Download', value: 'download', prependIcon: 'tabler-download' },
    {
      title: 'Edit',
      value: 'edit',
      prependIcon: 'tabler-pencil',
      to: { name: 'apps-invoice-edit-id', params: { id: paramId } },
    },
    { title: 'Duplicate', value: 'duplicate', prependIcon: 'tabler-layers-intersect' },
  ])
})

// 👉 Delete Produto
const deleteProduto = async (ids: number[]) => {
  console.log('Delete', ids);
}
</script>

<template>
  <OPageTitle class="pb-4" title="Fornecedores" />
  <section v-if="items">
    <VCard id="suppliers-list">
      <VCardText class="d-flex justify-space-between align-center flex-wrap gap-4">
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
              style="inline-size: 5.5rem;"
              @update:model-value="itemsPerPage = parseInt($event, 10)"
            />
          </div>
          <!-- 👉 Adicionar -->
          <VBtn
            prepend-icon="tabler-plus"
            :to="{ name: 'apps-invoice-add' }"
          >
            Adicionar
          </VBtn>
        </div>

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="cliente-list-filter">
            <AppTextField
              v-model="searchQuery"
              placeholder="Buscar cliente"
            />
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
          <IconBtn :to="{ name: 'apps-invoice-preview-id', params: { id: item.id } }">
            <VIcon icon="tabler-eye" />
          </IconBtn>

          <IconBtn @click="deleteProduto([item.id])">
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

<style lang="scss">
#cliente-list {
  .cliente-list-actions {
    inline-size: 8rem;
  }

  .cliente-list-filter {
    inline-size: 12rem;
  }
}
</style>
