<template>
  <div class="auth-login-page">
    <div class="login-container">
      <div class="background-decoration">
        <div class="decoration-circle decoration-circle--1"></div>
        <div class="decoration-circle decoration-circle--2"></div>
        <div class="decoration-circle decoration-circle--3"></div>
      </div>

      <CommonCard variant="glass" class="login-card">
        <div class="login-header">
          <div class="logo-section">
            <q-icon name="task_alt" class="logo-icon" />
            <h1 class="app-title">TaskManager</h1>
          </div>
          <p class="login-subtitle">Войдите в свою учетную запись</p>
        </div>

        <CommonForm variant="minimal" @submit="handleLogin">
          <div class="form-section">
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
              placeholder="Введите ваш пароль"
              variant="modern"
              :rules="passwordRules"
              :loading="loading"
            />

            <div class="form-options">
              <q-checkbox
                v-model="form.rememberMe"
                label="Запомнить меня"
                color="primary"
                class="remember-checkbox"
              />
              <q-btn
                flat
                color="white"
                label="Забыли пароль?"
                class="forgot-password-btn"
                style="color: #fff; text-decoration: underline; font-weight: 600;"
                @click="showForgotPassword = true"
              />
            </div>
          </div>

          <div class="form-actions">
            <CommonButton
              type="submit"
              label="Войти"
              icon="login"
              variant="gradient"
              size="lg"
              :loading="loading"
              :disabled="!isFormValid"
              class="login-btn"
            />
          </div>
        </CommonForm>

        <div class="login-footer">
          <p class="register-text">
            Нет учетной записи?
            <q-btn
              flat
              color="primary"
              label="Зарегистрироваться"
              class="register-btn"
              @click="goToRegister"
            />
          </p>
        </div>
      </CommonCard>

      <CommonCard variant="minimal" class="demo-card">
        <div class="demo-header">
          <q-icon name="info" color="info" />
          <span class="demo-title">Демо доступ</span>
        </div>
        <div class="demo-credentials">
          <div class="credential-item">
            <span class="credential-label">Email:</span>
            <span class="credential-value">admin@example.com</span>
            <q-btn
              flat
              round
              dense
              icon="content_copy"
              size="sm"
              @click="copyToClipboard('admin@example.com')"
            />
          </div>
          <div class="credential-item">
            <span class="credential-label">Пароль:</span>
            <span class="credential-value">admin123</span>
            <q-btn
              flat
              round
              dense
              icon="content_copy"
              size="sm"
              @click="copyToClipboard('admin123')"
            />
          </div>
        </div>
      </CommonCard>
    </div>

    <CommonDialog
      v-model="showForgotPassword"
      title="Восстановление пароля"
      variant="modern"
      size="md"
    >
      <p class="forgot-password-text">
        Введите ваш email, и мы отправим инструкции по восстановлению пароля.
      </p>

      <CommonInput
        v-model="forgotPasswordEmail"
        label="Email"
        type="email"
        placeholder="Введите ваш email"
        variant="modern"
        :rules="emailRules"
      />

      <template #footer>
        <q-btn
          flat
          label="Отмена"
          @click="showForgotPassword = false"
        />
        <q-btn
          unelevated
          color="primary"
          label="Отправить"
          :loading="sendingResetEmail"
          @click="sendResetEmail"
        />
      </template>
    </CommonDialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import CommonCard from 'src/components/common/CommonCard.vue'
import CommonForm from 'src/components/common/CommonForm.vue'
import CommonInput from 'src/components/common/CommonInput.vue'
import CommonButton from 'src/components/common/CommonButton.vue'
import CommonDialog from 'src/components/common/CommonDialog.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const sendingResetEmail = ref(false)
const showForgotPassword = ref(false)
const forgotPasswordEmail = ref('')

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const emailRules = [
  val => !!val || 'Email обязателен',
  val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Введите корректный email'
]

const passwordRules = [
  val => !!val || 'Пароль обязателен',
  val => val.length >= 6 || 'Пароль должен содержать минимум 6 символов'
]

const isFormValid = computed(() => {
  return form.value.email && form.value.password &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email) &&
         form.value.password.length >= 6
})

const handleLogin = async () => {
  if (!isFormValid.value) {
    console.log('Form validation failed')
    return
  }

  loading.value = true

  try {
    const result = await authStore.login({
      email: form.value.email,
      password: form.value.password
    })

    if (result.success) {
      console.log('Login successful!')

      await authStore.getProfile()

      router.replace('/dashboard')
    } else {
      console.log('Login failed:', result.error)
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    console.log('Copied to clipboard:', text)
  } catch (error) {
    console.error('Copy error:', error)
  }
}

const sendResetEmail = async () => {
  if (!forgotPasswordEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail.value)) {
    console.log('Invalid email for password reset')
    return
  }

  sendingResetEmail.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Password reset email sent')

    showForgotPassword.value = false
    forgotPasswordEmail.value = ''
  } catch (error) {
    console.error('Password reset error:', error)
  } finally {
    sendingResetEmail.value = false
  }
}
</script>

<style lang="scss" scoped>
.auth-login-page {
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

  .login-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 450px;

    // Login card
    .login-card {
      padding: 3rem 2rem;
      margin-bottom: 2rem;

      .login-header {
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

        .login-subtitle {
          color: #b3b8c5;
          font-size: 1.125rem;
          margin: 0;
        }
      }

      .form-section {
        margin-bottom: 2rem;

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;

          .remember-checkbox {
            color: #b3b8c5;
          }

          .forgot-password-btn {
            font-size: 0.875rem;
          }
        }
      }

      .form-actions {
        .login-btn {
          width: 100%;
          margin-bottom: 1.5rem;
        }
      }

      .login-footer {
        text-align: center;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(226, 232, 240, 0.5);

        .register-text {
          color: #b3b8c5;
          margin: 0;

          .register-btn {
            font-weight: 600;
          }
        }
      }
    }

    // Demo card
    .demo-card {
      padding: 1.5rem;

      .demo-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;

        .demo-title {
          font-weight: 600;
          color: #f1f1f1;
        }
      }

      .demo-credentials {
        .credential-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;

          &:last-child {
            margin-bottom: 0;
          }

          .credential-label {
            font-weight: 500;
            color: #b3b8c5;
            min-width: 60px;
          }

          .credential-value {
            font-family: 'Courier New', monospace;
            background: rgba(102, 126, 234, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            color: #667eea;
            font-weight: 500;
            flex: 1;
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

.auth-login-page .login-container {
  animation: fadeInUp 0.6s ease-out;
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .auth-login-page {
    .login-container {
      .login-card {
        .login-header {
          .logo-section .app-title {
            color: #f1f1f1;
          }

          .login-subtitle {
            color: #b3b8c5;
          }
        }

        .login-footer {
          border-top-color: rgba(74, 85, 104, 0.5);

          .register-text {
            color: #b3b8c5;
          }
        }
      }

      .demo-card {
        .demo-header .demo-title {
          color: #f1f1f1;
        }

        .demo-credentials .credential-item {
          .credential-label {
            color: #e2e8f0;
          }

          .credential-value {
            background: rgba(102, 126, 234, 0.2);
            color: #93c5fd;
          }
        }
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .auth-login-page {
    padding: 1rem;

    .login-container {
      .login-card {
        padding: 2rem 1.5rem;

        .login-header {
          .logo-section {
            .logo-icon {
              font-size: 2.5rem;
            }

            .app-title {
              font-size: 1.75rem;
            }
          }
        }

        .form-actions .social-login {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}

// Loading states
.auth-login-page .login-container .login-card {
  &.loading {
    opacity: 0.7;
    pointer-events: none;
  }
}

// Focus states
.auth-login-page .login-container .login-card:focus-within {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

// Hover effects
.auth-login-page .login-container .login-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>
