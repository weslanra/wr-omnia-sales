<script setup lang="ts">
import { User } from "@/plugins/fake-api/handlers/users/types";
import ODialogAddClient from "@/views/records/client/ODialogAddClient.vue";

const idPrefix = "user";
const searchQuery = ref("");
const selectedProfile = ref<string | null>(null);
const selectedPointSale = ref<number | null>(null);
const selectedActive = ref<boolean | null>(null);
const selectedRows = ref<string[]>([]);

const isDrawerOpenAdd = ref(false);

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
  { title: "CPF", key: "cpf", sortable: false },
  { title: "Nome", key: "name" },
  { title: "E-mail", key: "email" },
  { title: "Perfil", key: "profile" },
  { title: "Ativo", key: "active" },
  { title: "Ações", key: "actions", sortable: false },
];

// 👉 Fetch clientes
const { data: userData } = await useApi<any>(
  createUrl("/users", {
    query: {
      q: searchQuery,
      profile: selectedProfile,
      pointSale: selectedPointSale,
      active: selectedActive,
      itemsPerPage,
      page,
      sortBy,
      orderBy,
    },
  })
);

const items = computed((): User[] => userData.value.data);
const totalItems = computed(() => userData.value.total);

const toggleDialogAdd = () => {
  isDrawerOpenAdd.value = !isDrawerOpenAdd.value;
};
</script>

<template>
  <OPageTitle class="pb-4" title="Usuários" />
  <section :id="`${idPrefix}-list`">
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Filtros</VCardTitle>
      </VCardItem>

      <VCardText>
        <VRow>
          <!-- 👉 Select perfil -->
          <VCol cols="12" md="4" lg="3">
            <div class="filter-profile">
              <AppSelect
                v-model="selectedProfile"
                placeholder="Perfil"
                clearable
                clear-icon="tabler-x"
                single-line
                :items="['Administrador', 'Gerente de vendas', 'Vendedor']"
              />
            </div>
          </VCol>
          <!-- 👉 Select ativo -->
          <VCol cols="12" md="4" lg="3">
            <div class="filter-point-of-sale">
              <AppSelect
                v-model="selectedPointSale"
                placeholder="Ponto de venda"
                clearable
                clear-icon="tabler-x"
                single-line
                :items="[
                  { title: 'OMNIA | Aracaju', value: 1 },
                  { title: 'OMNIA | Salvador', value: 2 },
                  { title: 'OMNIA | São Paulo', value: 3 },
                ]"
              />
            </div>
          </VCol>
          <!-- 👉 Select ativo -->
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
              :model-value="itemsPerPage"
              :items="[
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' },
                { value: -1, title: 'All' },
              ]"
              class="filter-per-page"
              @update:model-value="itemsPerPage = parseInt($event, 10)"
            />
          </div>
        </div>

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="list-filter">
            <AppTextField v-model="searchQuery" placeholder="Buscar" />
          </div>
          <!-- 👉 Adicionar -->
          <VBtn prepend-icon="tabler-plus" @click="toggleDialogAdd">
            Adicionar
          </VBtn>
        </div>
      </VCardText>

      <!-- SECTION Datatable -->
      <VDataTableServer
        v-model="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items-length="totalItems"
        :headers="headers"
        :items="items"
        item-value="id"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- codigo -->
        <template #item.codigo="{ item }">
          <RouterLink
            :to="{ name: 'settings-user-view-id', params: { id: item.id } }"
          >
            #{{ item.codigo }}
          </RouterLink>
        </template>

        <!-- Name -->
        <template #item.name="{ item }">
          <RouterLink
            :to="{
              name: 'settings-user-view-id',
              params: { id: item.id },
            }"
            class="text-link font-weight-medium"
          >
            {{ item.name }}
          </RouterLink>
        </template>

        <!-- Adimplente -->
        <template #item.active="{ item }">
          {{ item.active ? "Sim" : "Não" }}
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn
            :to="{ name: 'records-client-view-id', params: { id: item.id } }"
          >
            <VIcon icon="tabler-pencil" />
          </IconBtn>
          <IconBtn @click="() => {}">
            <VIcon icon="tabler-trash" />
          </IconBtn>
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

  <!-- 👉 Dialog Add Cliente -->
  <ODialogAddClient v-model="isDrawerOpenAdd" />
</template>
<style lang="scss" scoped>
.filter-per-page {
  inline-size: 5.5rem;
}

.list-filter {
  inline-size: 15.625rem;
}
</style>