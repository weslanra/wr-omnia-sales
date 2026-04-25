<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VForm } from 'vuetify/components/VForm'

// store
import { useLoginStore } from "@/views/login/useLoginStore"

const useLogin = useLoginStore()

interface Params {
  email: string;
  code: string;
}

const code = ref('')
const email = ref('')
const refVForm = ref<VForm>()
const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

onMounted(() => {
  email.value = useLogin.credentials.email;

  // Adicionar validação se é dev mode;
  if(useLogin.mockMeta.code) {
    code.value = useLogin.mockMeta.code;
  }

  console.log("confirm-code", email.value, code.value);
})

const sendRecoveryCode = async () => {
  // TODO: adicionar toasts
  return await $api('/api/user/validateRecoveryCode', {
      method: 'POST',
      body: {
        code: code.value,
        email: email.value
      },
      onResponse({ response }) {
        const data = response._data as { valid: boolean };

        if(data.valid) {
          console.log("Código válido")
        } else {
          console.log("Código inválido")
        }
      },
      onResponseError({ response }) {
        console.log(response);
      },
    })
}

const onSubmit = () => {
  refVForm.value?.validate()
    .then(({ valid: isValid }) => {
      if (isValid)
        sendRecoveryCode()
    })
}
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

  <VRow
    class="auth-wrapper bg-surface"
    no-gutters
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background w-100 me-0">
        <div
          class="d-flex align-center justify-center w-100 h-100"
          style="padding-inline: 150px;"
        >
          <VImg
            max-width="468"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <img
          class="auth-footer-mask"
          :src="authThemeMask"
          alt="auth-footer-mask"
          height="280"
          width="100"
        >
      </div>
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Confirm the code 🔒
          </h4>
          <p class="mb-0">
            Enter the code sent by email
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- code -->
              <VCol cols="12">
                <AppTextField
                  v-model="code"
                  autofocus
                  label="Code"
                  type="text"
                  placeholder="123 456"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Confirm code -->
              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                >
                  Confirm Code
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  :to="{ name: 'login' }"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    size="20"
                    class="me-1 flip-in-rtl"
                  />
                  <span>Back to login</span>
                </RouterLink>
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
