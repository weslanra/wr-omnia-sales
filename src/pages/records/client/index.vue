<script setup lang="ts">
import { Client, TipoCliente } from "@/plugins/fake-api/handlers/clients/types";
import ODialogAddClient from "@/views/records/client/ODialogAddClient.vue";

const searchQuery = ref("");
const selectedTipo = ref<TipoCliente | null>(null);
const selectedAdimplente = ref<TipoCliente | null>(null);
const selectedRows = ref<string[]>([]);

const isDrawerOpenAddClient = ref(false);

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

const widgetData = ref([
  { title: "Clientes", value: 24, icon: "tabler-user" },
  { title: "Fornecedores", value: 165, icon: "tabler-briefcase" },
  { title: "Outros", value: 0, icon: "tabler-users" },
  { title: "Inadimplentes", value: "$2.46k", icon: "tabler-chart-pie-2" },
]);

// 👉 headers
const headers = [
  { title: "Cód.", key: "codigo" },
  { title: "Tipo", key: "tipo", sortable: false },
  { title: "Nome", key: "nome", sortable: false },
  { title: "CPF/CNPJ", key: "cpfCnpj" },
  { title: "Cidade/UF", key: "municipioNome" },
  { title: "Telefone", key: "telefone" },
  { title: "Sit. Financeira", key: "adimplente" },
  { title: "Ações", key: "actions", sortable: false },
];

// 👉 Fetch clientes
const { data: clienteData, execute: fetchClientes } = await useApi<any>(
  createUrl("/clientes", {
    query: {
      q: searchQuery,
      tipo: selectedTipo,
      adimplente: selectedAdimplente,
      itemsPerPage,
      page,
      sortBy,
      orderBy,
    },
  })
);

const clientes = computed((): Client[] => clienteData.value.clientes);
const totalClientes = computed(() => clienteData.value.totalClientes);

// 👉 Delete Cliente
const deleteCliente = async (id: number) => {
  await $api(`/clientes/${id}`, { method: "DELETE" });

  // TODO: integrar
  fetchClientes();
};

// 👉 Tipo cliente variant resolver
const resolveTipoClienteVariantAndIcon = (status: string) => {
  if (status === TipoCliente.CLIENTE)
    return { variant: "info", icon: "tabler-user" };
  if (status === TipoCliente.FORNECEDOR)
    return { variant: "warning", icon: "tabler-briefcase" };

  return { variant: "secondary", icon: "tabler-x" };
};

// 👉 Invoice balance variant resolver
const resolveAdimplenteClienteVariant = (adimplente: boolean) => {
  if (adimplente) return { status: "Adimplente", chip: { color: "success" } };
  else return { status: "Inadimplente", chip: { color: "error" } };
};

const toggleDialogAddClient = () => {
  isDrawerOpenAddClient.value = !isDrawerOpenAddClient.value;
};
</script>

<template>
  <OPageTitle class="pb-4" title="Clientes" />
  <section id="client-list">
    <!-- 👉 Cliente Widgets -->
    <VCard class="mb-6">
      <VCardText class="px-3">
        <VRow>
          <template v-for="(data, id) in widgetData" :key="id">
            <VCol cols="12" sm="6" md="3" class="px-6">
              <div
                class="d-flex justify-space-between align-center"
                :class="
                  $vuetify.display.xs
                    ? id !== widgetData.length - 1
                      ? 'border-b pb-4'
                      : ''
                    : $vuetify.display.sm
                    ? id < widgetData.length / 2
                      ? 'border-b pb-4'
                      : ''
                    : ''
                "
              >
                <div class="d-flex flex-column">
                  <h4 class="text-h4">
                    {{ data.value }}
                  </h4>
                  <span class="text-body-1 text-capitalize">{{
                    data.title
                  }}</span>
                </div>

                <VAvatar variant="tonal" rounded size="42">
                  <VIcon :icon="data.icon" size="26" color="high-emphasis" />
                </VAvatar>
              </div>
            </VCol>
            <VDivider
              v-if="
                $vuetify.display.mdAndUp
                  ? id !== widgetData.length - 1
                  : $vuetify.display.smAndUp
                  ? id % 2 === 0
                  : false
              "
              vertical
              inset
              length="60"
            />
          </template>
        </VRow>
      </VCardText>
    </VCard>

    <VCard id="client-list">
      <VCardItem class="pb-4">
        <VCardTitle>Filtros</VCardTitle>
      </VCardItem>

      <VCardText>
        <VRow>
          <VCol cols="12" md="4" lg="3">
            <!-- 👉 Select tipo -->
            <div class="client-list-filter">
              <AppSelect
                v-model="selectedTipo"
                placeholder="Tipo cliente"
                clearable
                clear-icon="tabler-x"
                single-line
                :items="['Cliente', 'Fornecedor', 'Inadimplentes']"
              />
            </div>
          </VCol>
          <VCol cols="12" md="4" lg="3">
            <!-- 👉 Select adimplente -->
            <div class="client-list-filter">
              <AppSelect
                v-model="selectedAdimplente"
                placeholder="Sit. Financeira"
                clearable
                clear-icon="tabler-x"
                single-line
                :items="[
                  { title: 'Adimplente', value: true },
                  { title: 'Inadimplente', value: false },
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
        </div>

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="list-filter">
            <AppTextField v-model="searchQuery" placeholder="Buscar cliente" />
          </div>
          <!-- 👉 Adicionar -->
          <VBtn prepend-icon="tabler-plus" @click="toggleDialogAddClient">
            Adicionar
          </VBtn>
        </div>
      </VCardText>

      <!-- SECTION Datatable -->
      <VDataTableServer
        v-model="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        show-select
        :items-length="totalClientes"
        :headers="headers"
        :items="clientes"
        item-value="id"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- codigo -->
        <template #item.codigo="{ item }">
          <RouterLink
            :to="{ name: 'records-client-view-id', params: { id: item.id } }"
          >
            #{{ item.codigo }}
          </RouterLink>
        </template>

        <!-- Cliente -->
        <template #item.nome="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              size="34"
              :color="
                !item.avatar.length
                  ? resolveTipoClienteVariantAndIcon(item.tipo).variant
                  : undefined
              "
              :variant="!item.avatar.length ? 'tonal' : undefined"
              class="me-3"
            >
              <VImg v-if="item.avatar.length" :src="item.avatar" />
              <span v-else>{{ avatarText(item.nome) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <RouterLink
                :to="{
                  name: 'records-client-view-id',
                  params: { id: item.id },
                }"
                class="text-link font-weight-medium"
              >
                {{ item.nome }}
              </RouterLink>
              <span class="text-sm text-medium-emphasis">{{ item.email }}</span>
            </div>
          </div>
        </template>

        <!-- tipo -->
        <template #item.tipo="{ item }">
          <VTooltip>
            <template #activator="{ props }">
              <VAvatar
                :size="28"
                v-bind="props"
                :color="resolveTipoClienteVariantAndIcon(item.tipo).variant"
                variant="tonal"
              >
                <VIcon
                  :size="16"
                  :icon="resolveTipoClienteVariantAndIcon(item.tipo).icon"
                />
              </VAvatar>
            </template>
            {{ item.tipo }}
          </VTooltip>
        </template>

        <!-- municipioNome -->
        <template #item.municipioNome="{ item }">
          {{ item.municipioNome }} / {{ item.uf }}
        </template>

        <!-- Adimplente -->
        <template #item.adimplente="{ item }">
          <VChip
            v-if="
              typeof resolveAdimplenteClienteVariant(item.adimplente).status ===
              'string'
            "
            :color="resolveAdimplenteClienteVariant(item.adimplente).chip.color"
            label
            size="x-small"
          >
            {{ resolveAdimplenteClienteVariant(item.adimplente).status }}
          </VChip>

          <template v-else>
            <span class="text-base text-high-emphasis">
              {{
                Number(
                  resolveAdimplenteClienteVariant(item.adimplente).status
                ) > 0
                  ? `$${
                      resolveAdimplenteClienteVariant(item.adimplente).status
                    }`
                  : `-$${Math.abs(
                      Number(
                        resolveAdimplenteClienteVariant(item.adimplente).status
                      )
                    )}`
              }}
            </span>
          </template>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn @click="deleteCliente(item.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>

          <IconBtn
            :to="{ name: 'records-client-view-id', params: { id: item.id } }"
          >
            <VIcon icon="tabler-pencil" />
          </IconBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalClientes"
          />
        </template>
      </VDataTableServer>
      <!-- !SECTION -->
    </VCard>
  </section>

  <!-- 👉 Dialog Add Cliente -->
  <ODialogAddClient v-model="isDrawerOpenAddClient" />
</template>

<style lang="scss">
.filter-per-page {
  inline-size: 5.5rem;
}

.list-filter {
  inline-size: 15.625rem;
}
</style>
