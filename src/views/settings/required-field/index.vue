<script setup lang="ts">
import { PointOfSale } from "@/plugins/fake-api/handlers/points-of-sale/types";

interface Props {
  type: "client" | "product";
}

const props = withDefaults(defineProps<Props>(), {});
const type = computed(() => props.type);
const searchQuery = ref("");
const selectedRequired = ref<boolean | null>(null);
const selectedOptional = ref<boolean | null>(null);
const selectedRows = ref<string[]>([]);

// Data table options
const itemsPerPage = ref(10);
const page = ref(1);
const sortBy = ref("field");
const orderBy = ref("desc");

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key;
  orderBy.value = options.sortBy[0]?.order;
};

// 👉 headers
const headers = [
  { title: "Campo", key: "field" },
  { title: "Obrigatório", key: "required" },
  { title: "Desejável", key: "optional" },
  { title: "Actions", key: "actions", sortable: false },
];

// 👉 Fetch points of sale
const { data: requiredFieldsData, execute: fetchRequiredFields } =
  await useApi<any>(
    createUrl("/required-fields/" + type.value, {
      query: {
        q: searchQuery,
        page,
        itemsPerPage,
        sortBy,
        orderBy,
        // Custom filters
        required: selectedRequired,
        optional: selectedOptional,
      },
    })
  );

const requiredFields = computed(
  (): PointOfSale[] => requiredFieldsData.value.data
);
const totalRequiredFields = computed(() => requiredFieldsData.value.total);

// 👉 Delete required field
const deleteRequiredField = async (field: string) => {
  await $api(`/required-fields/${type.value}/${field}`, { method: "DELETE" });

  fetchRequiredFields();
};
</script>

<template>
  <section v-if="requiredFields">
    <VCard>
      <VCardItem class="pb-4">
        <VCardTitle>Filtros</VCardTitle>
      </VCardItem>

      <VCardText>
        <VRow>
          <!-- 👉 Select required -->
          <VCol cols="12" md="4" lg="3">
            <div class="filter-required">
              <AppSelect
                v-model="selectedRequired"
                placeholder="Obrigatório"
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

          <!-- 👉 Select optional -->
          <VCol cols="12" md="4" lg="3">
            <div class="filter-optional">
              <AppSelect
                v-model="selectedOptional"
                placeholder="Opcional"
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
        :items-length="totalRequiredFields"
        :headers="headers"
        :items="requiredFields"
        item-value="id"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- Required -->
        <template #item.required="{ item }">
          <VCheckbox v-model="item.required" />
        </template>

        <!-- Optional -->
        <template #item.optional="{ item }">
          <VCheckbox v-model="item.optional" />
        </template>

        <!-- Actions -->
        <!-- TODO: fazer o redirect de edit -->
        <template #item.actions="{ item }">
          <IconBtn @click="() => deleteRequiredField(item.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalRequiredFields"
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
