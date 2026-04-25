<script lang="ts" setup>
import { RouteLocationRaw } from "vue-router/auto";

export interface Breadcrumb {
  title: string;
  to: RouteLocationRaw;
}

interface Props {
  title: string;
  description?: string;
  divisor?: string;
  icon?: string;
  breadcrumb?: Array<Breadcrumb>;
}

const props = withDefaults(defineProps<Props>(), {
  divisor: "tabler-chevron-right",
  icon: "tabler-home",
});
</script>

<template>
  <div class="f-page-title">
    <div class="d-flex align-items-center gap-2">
      <h4 class="text-h4">
        {{ props.title }}
      </h4>

      <div v-if="props.breadcrumb" class="pl-3 b-left">
        <VBreadcrumbs class="px-0 py-2" :items="props.breadcrumb">
          <template v-slot:prepend>
            <div>
              <RouterLink to="/">
                <VIcon color="primary" size="18" :icon="props.icon" />
              </RouterLink>
              <VIcon size="16" class="mx-2" :icon="props.divisor"></VIcon>
            </div>
          </template>
          <template v-slot:title="{ item, index }">
            <span
              class="text-subtitle-1"
              :class="{
                'text-primary': index !== props.breadcrumb.length - 1,
              }"
            >
              {{ item.title }}
            </span>
          </template>
          <template v-slot:divider>
            <VIcon size="16" :icon="props.divisor"></VIcon>
          </template>
        </VBreadcrumbs>
      </div>
    </div>

    <div v-if="props.description" class="text-body-1">
      {{ props.description }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.b-left {
  border-inline-start: 1px solid #dbdade;
}
</style>
