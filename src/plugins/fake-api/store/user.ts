import { defineStore } from "pinia";

export type RecoveryCode = {
  email: string;
  code: string;
}

// SECTION Store
const fakeUserStore = defineStore("fake-user", () => {
  const recoveryCodes  = ref<RecoveryCode[]>([]);

  const addRecoveryCode = (newRecoveryCode: RecoveryCode): void => {
    recoveryCodes.value.push(newRecoveryCode);
  }

  const verifyRecoveryCode = (recoveryCode: RecoveryCode): boolean => {
    const data = recoveryCodes.value.find(it => it.email == recoveryCode.email && it.code == recoveryCode.code);

    return data != undefined;
  }

  return {
    // states
    recoveryCodes,

    // actions
    addRecoveryCode,
    verifyRecoveryCode,
  };
});

export default fakeUserStore;
