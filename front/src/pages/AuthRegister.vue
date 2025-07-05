<template>
  <div class="auth-register-page">
    <div class="register-container">
      <!-- Background decoration -->
      <div class="background-decoration">
        <div class="decoration-circle decoration-circle--1"></div>
        <div class="decoration-circle decoration-circle--2"></div>
        <div class="decoration-circle decoration-circle--3"></div>
      </div>

      <CommonCard variant="glass" class="register-card">
        <div class="register-header">
          <div class="logo-section">
            <q-icon name="task_alt" class="logo-icon" />
            <h1 class="app-title">TaskManager</h1>
          </div>
          <p class="register-subtitle">Создайте новую учетную запись</p>
        </div>

        <CommonForm variant="minimal" @submit="handleRegister">
          <div class="form-section">
            <CommonInput
              v-model="form.firstName"
              label="Имя"
              type="text"
              placeholder="Введите ваше имя"
              variant="modern"
              :rules="firstNameRules"
              :loading="loading"
            />

            <CommonInput
              v-model="form.lastName"
              label="Фамилия"
              type="text"
              placeholder="Введите вашу фамилию"
              variant="modern"
              :rules="lastNameRules"
              :loading="loading"
            />

            <CommonInput
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="Введите ваш email"
              variant="modern"
              :rules="emailRules"
              :loading="loading"
            />

            <CommonInput
              v-model="form.password"
              label="Пароль"
              type="password"
              placeholder="Введите пароль"
              variant="modern"
              :rules="passwordRules"
              :loading="loading"
            />

            <CommonInput
              v-model="form.confirmPassword"
              label="Подтвердите пароль"
              type="password"
              placeholder="Повторите пароль"
              variant="modern"
              :rules="confirmPasswordRules"
              :loading="loading"
            />

            <div class="form-options">
              <q-checkbox
                v-model="form.agreeToTerms"
                label="Я согласен с условиями использования"
                color="primary"
                class="terms-checkbox"
                :rules="[val => val || 'Необходимо согласиться с условиями']"
              />
            </div>
          </div>

          <div class="form-actions">
            <CommonButton
              type="submit"
              label="Зарегистрироваться"
              icon="person_add"
              variant="gradient"
              size="lg"
              :loading="loading"
              :disabled="!isFormValid"
              class="register-btn"
            />
          </div>
        </CommonForm>

        <div class="register-footer">
          <p class="login-text">
            Уже есть учетная запись?
            <q-btn
              flat
              color="primary"
              label="Войти"
              class="login-btn"
              @click="goToLogin"
            />
          </p>
        </div>
      </CommonCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import CommonCard from 'src/components/common/CommonCard.vue'
import CommonForm from 'src/components/common/CommonForm.vue'
import CommonInput from 'src/components/common/CommonInput.vue'
import CommonButton from 'src/components/common/CommonButton.vue'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const loading = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const firstNameRules = [
  val => !!val || 'Имя обязательно',
  val => val.length >= 2 || 'Имя должно содержать минимум 2 символа'
]

const lastNameRules = [
  val => !!val || 'Фамилия обязательна',
  val => val.length >= 2 || 'Фамилия должна содержать минимум 2 символа'
]

const emailRules = [
  val => !!val || 'Email обязателен',
  val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Введите корректный email'
]

const passwordRules = [
  val => !!val || 'Пароль обязателен',
  val => val.length >= 6 || 'Пароль должен содержать минимум 6 символов'
]

const confirmPasswordRules = [
  val => !!val || 'Подтвердите пароль',
  val => val === form.value.password || 'Пароли не совпадают'
]

const isFormValid = computed(() => {
  return form.value.firstName &&
         form.value.lastName &&
         form.value.email &&
         form.value.password &&
         form.value.confirmPassword &&
         form.value.agreeToTerms &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email) &&
         form.value.password.length >= 6 &&
         form.value.password === form.value.confirmPassword
})

const handleRegister = async () => {
  if (!isFormValid.value) {
    console.log('Пожалуйста, заполните все поля корректно')
    return
  }

  loading.value = true

  try {
    await authStore.register({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password
    })
    console.log('Регистрация успешна! Добро пожаловать!')
    router.push('/')
  } catch (error) {
    console.error('Register error:', error)
    console.log(error.message || 'Ошибка регистрации. Попробуйте еще раз.')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.auth-register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  // Background decoration
  .background-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 0;

    .decoration-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;

      &--1 {
        width: 200px;
        height: 200px;
        top: 10%;
        left: 10%;
        animation-delay: 0s;
      }

      &--2 {
        width: 150px;
        height: 150px;
        top: 60%;
        right: 15%;
        animation-delay: 2s;
      }

      &--3 {
        width: 100px;
        height: 100px;
        bottom: 20%;
        left: 20%;
        animation-delay: 4s;
      }
    }
  }

  .register-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 500px;

    // Register card
    .register-card {
      padding: 3rem 2rem;

      .register-header {
        text-align: center;
        margin-bottom: 2rem;

        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;

          .logo-icon {
            font-size: 3rem;
            color: #667eea;
          }

          .app-title {
            font-size: 2rem;
            font-weight: 700;
            color: #f1f1f1;
            margin: 0;
            letter-spacing: -0.025em;
          }
        }

        .register-subtitle {
          color: #b3b8c5;
          font-size: 1.125rem;
          margin: 0;
        }
      }

      .form-section {
        margin-bottom: 2rem;

        .form-options {
          margin-top: 1rem;

          .terms-checkbox {
            color: #b3b8c5;
          }
        }
      }

      .form-actions {
        .register-btn {
          width: 100%;
          margin-bottom: 1.5rem;
        }
      }

      .register-footer {
        text-align: center;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(226, 232, 240, 0.5);

        .login-text {
          color: #b3b8c5;
          margin: 0;

          .login-btn {
            font-weight: 600;
          }
        }
      }
    }
  }
}

// Animations
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-register-page .register-container {
  animation: fadeInUp 0.6s ease-out;
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .auth-register-page {
    .register-container {
      .register-card {
        .register-header {
          .logo-section .app-title {
            color: #f1f1f1;
          }

          .register-subtitle {
            color: #b3b8c5;
          }
        }

        .form-section .form-options .terms-checkbox {
          color: #e2e8f0;
        }

        .register-footer {
          border-top-color: rgba(74, 85, 104, 0.5);

          .login-text {
            color: #b3b8c5;
          }
        }
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .auth-register-page {
    padding: 1rem;

    .register-container {
      .register-card {
        padding: 2rem 1.5rem;

        .register-header {
          .logo-section {
            .logo-icon {
              font-size: 2.5rem;
            }

            .app-title {
              font-size: 1.75rem;
            }
          }
        }
      }
    }
  }
}

// Loading states
.auth-register-page .register-container .register-card {
  &.loading {
    opacity: 0.7;
    pointer-events: none;
  }
}

// Focus states
.auth-register-page .register-container .register-card:focus-within {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

// Hover effects
.auth-register-page .register-container .register-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>
