<script setup lang="ts">
import { VForm } from "vuetify/components/VForm";

import AuthProvider from "@/views/pages/authentication/AuthProvider.vue";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";

import authV2RegisterIllustrationBorderedDark from "@images/pages/auth-v2-register-illustration-bordered-dark.png";
import authV2RegisterIllustrationBorderedLight from "@images/pages/auth-v2-register-illustration-bordered-light.png";
import authV2RegisterIllustrationDark from "@images/pages/auth-v2-register-illustration-dark.png";
import authV2RegisterIllustrationLight from "@images/pages/auth-v2-register-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";

const imageVariant = useGenerateImageVariant(
  authV2RegisterIllustrationLight,
  authV2RegisterIllustrationDark,
  authV2RegisterIllustrationBorderedLight,
  authV2RegisterIllustrationBorderedDark,
  true
);

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);

definePage({
  meta: {
    layout: "blank",
    unauthenticatedOnly: true,
  },
});

const route = useRoute();
const router = useRouter();

const ability = useAbility();
const refVForm = ref<VForm>();
const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
});

const form = ref({
  username: "",
  email: "",
  password: "",
  privacyPolicies: false,
});

const isPasswordVisible = ref(false);

const register = async () => {
  try {
    const res = await $api("/auth/register", {
      method: "POST",
      body: {
        userName: form.value.username,
        email: form.value.email,
        password: form.value.password,
      },
      onResponseError({ response }) {
        errors.value = response._data.errors;
      },
    });

    const { accessToken, userData, userAbilityRules } = res;

    useCookie("userAbilityRules").value = userAbilityRules;
    ability.update(userAbilityRules);

    useCookie("userData").value = userData;
    useCookie("accessToken").value = accessToken;

    // Redirect to `to` query if exist or redirect to index route
    // ❗ nextTick is required to wait for DOM updates and later redirect
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : "/");
    });
  } catch (err) {
    console.error(err);
  }
};

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      if (!form.value.privacyPolicies) {
        errors.value.privacyPolicies =
          "You must agree to the privacy policy & terms";
        return;
      }

      register();
    }
  });
};
</script>

<template>
  <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div
          class="d-flex align-center justify-center w-100 h-100"
          style="padding-inline: 100px"
        >
          <VImg
            max-width="500"
            :src="imageVariant"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <img
          class="auth-footer-mask"
          :src="authThemeMask"
          alt="auth-footer-mask"
          height="280"
          width="100"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface))"
    >
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <h4 class="text-h4 mb-1">A aventura inicia aqui 🚀</h4>
          <p class="mb-0">Faça sua gestão com um app fácil!</p>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- Username -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.username"
                  :rules="[requiredValidator]"
                  autofocus
                  label="Username"
                  placeholder="Johndoe"
                />
              </VCol>

              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                  type="email"
                  placeholder="johndoe@email.com"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  :rules="[requiredValidator]"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div
                  class="my-6"
                  :class="{
                    'v-input--error':
                      errors.privacyPolicies && !form.privacyPolicies,
                  }"
                >
                  <div class="d-flex align-center">
                    <VCheckbox
                      id="privacy-policy"
                      v-model="form.privacyPolicies"
                      inline
                    />
                    <VLabel for="privacy-policy" style="opacity: 1">
                      <span class="me-1 text-high-emphasis">I agree to</span>
                      <a href="javascript:void(0)" class="text-primary"
                        >privacy policy & terms</a
                      >
                    </VLabel>
                  </div>
                  <div
                    v-if="errors.privacyPolicies && !form.privacyPolicies"
                    class="v-input__details"
                  >
                    <div
                      class="v-messages"
                      role="alert"
                      aria-live="polite"
                      id="app-text-field-Username-1o95x-messages"
                    >
                      <div class="v-messages__message">
                        {{ errors.privacyPolicies }}
                      </div>
                    </div>
                    <!---->
                  </div>
                </div>

                <VBtn block type="submit"> Sign up </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-center text-base">
                <span class="d-inline-block">Already have an account?</span>
                <RouterLink
                  class="text-primary ms-1 d-inline-block"
                  :to="{ name: 'login' }"
                >
                  Sign in instead
                </RouterLink>
              </VCol>

              <VCol cols="12" class="d-flex align-center">
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol cols="12" class="text-center">
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
