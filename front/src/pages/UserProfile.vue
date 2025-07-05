<template>
  <q-page class="user-profile-page flex flex-center">
    <CommonCard variant="modern" class="profile-card">
      <template #header>
        <div class="profile-header">
          <h2 class="profile-title">Профиль пользователя</h2>
        </div>
      </template>
      <div class="profile-content">
        <CommonInput v-model="form.firstName" label="Имя" :readonly="true" input-class="input-white" label-class="label-white" />
        <CommonInput v-model="form.lastName" label="Фамилия" :readonly="true" input-class="input-white" label-class="label-white" />
        <CommonInput v-model="form.email" label="Email" input-class="input-white" label-class="label-white" />
        <div class="password-section">
          <CommonInput v-model="form.oldPassword" label="Старый пароль" type="password" input-class="input-white" label-class="label-white" />
          <CommonInput v-model="form.newPassword" label="Новый пароль" type="password" input-class="input-white" label-class="label-white" />
          <CommonInput v-model="form.confirmPassword" label="Подтвердите новый пароль" type="password" input-class="input-white" label-class="label-white" />
        </div>
        <div class="profile-actions q-mt-lg">
          <CommonButton label="Сохранить изменения" color="primary" class="save-btn" @click="saveProfile" />
        </div>
        <div class="profile-actions q-mt-md">
          <CommonButton label="Назад к дашборду" color="primary" flat @click="goToDashboard" />
        </div>
      </div>
    </CommonCard>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { ref, computed } from 'vue'
import CommonCard from 'components/common/CommonCard.vue'
import CommonInput from 'components/common/CommonInput.vue'
import CommonButton from 'components/common/CommonButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user || {})
const form = ref({
  firstName: user.value.firstName || '',
  lastName: user.value.lastName || '',
  email: user.value.email || '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

function goToDashboard() {
  router.push({ name: 'dashboard' })
}

function saveProfile() {
  // TODO: реализовать сохранение email и смену пароля через API
  console.log('Сохранение профиля:', form.value)
}
</script>

<style scoped>
.user-profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
}
.profile-card {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  background: rgba(30, 30, 40, 0.85);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 24px;
  color: #fff;
  padding: 32px 24px;
  backdrop-filter: blur(8px);
}
.profile-title {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
}
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.profile-actions {
  display: flex;
  justify-content: center;
}
.input-white :deep(input),
.input-white :deep(.q-field__native),
.input-white :deep(.q-field__input),
.input-white :deep(.q-field__control),
.input-white :deep(.q-field__label),
.label-white {
  color: #fff !important;
  caret-color: #fff !important;
}
.password-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}
.save-btn {
  width: 100%;
  font-weight: 700;
  font-size: 1.1rem;
}
</style>
