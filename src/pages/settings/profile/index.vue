<script setup lang="ts">
import { User } from "@/plugins/fake-api/handlers/users/types";
import ODialogAddClient from "@/views/records/client/ODialogAddClient.vue";

const idPrefix = "profile";
const searchQuery = ref("");
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
  { title: "Nome", key: "name" },
  { title: "Ativo", key: "active", align: "end" },
  {
    title: "Ações",
    key: "actions",
    width: "125px",
    align: "end",
    sortable: false,
  },
];

// 👉 Fetch clientes
const { data: userData } = await useApi<any>(
  createUrl("/profiles", {
    query: {
      q: searchQuery,
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

const resolveActiveVariant = (active: boolean) => {
  if (active) return { status: "Sim", chip: { color: "success" } };
  else return { status: "Não", chip: { color: "error" } };
};
</script>

<template>
  <OPageTitle class="pb-4" title="Perfis" />
  <section :id="`${idPrefix}-list`">
    <VCard>
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
        <!-- Name -->
        <template #item.name="{ item }">
          <RouterLink
            :to="{
              name: 'settings-profile-view-id',
              params: { id: item.id },
            }"
            class="text-link font-weight-medium"
          >
            {{ item.name }}
          </RouterLink>
        </template>

        <!-- Active -->
        <template #item.active="{ item }">
          <VChip
            :color="resolveActiveVariant(item.active).chip.color"
            label
            size="x-small"
          >
            {{ resolveActiveVariant(item.active).status }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn
            :to="{ name: 'settings-profile-view-id', params: { id: item.id } }"
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
