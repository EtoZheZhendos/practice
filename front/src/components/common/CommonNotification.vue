<template>
  <div class="common-notification">
    <q-banner
      :class="bannerClass"
      :color="color"
      :text-color="textColor"
      :icon="icon"
      :actions="actions"
      :dismissible="dismissible"
      :rounded="rounded"
      :elevated="elevated"
      :flat="flat"
      :bordered="bordered"
      :square="square"
      :dark="dark"
      @click="handleClick"
    >
      <template v-if="$slots.default" #default>
        <slot />
      </template>

      <template v-if="$slots.avatar" #avatar>
        <slot name="avatar" />
      </template>

      <template v-if="$slots.action" #action>
        <slot name="action" />
      </template>
    </q-banner>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  duration: {
    type: Number,
    default: 5000 // 5 секунд по умолчанию
  },
  persistent: {
    type: Boolean,
    default: false
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  showAvatar: {
    type: Boolean,
    default: true
  },
  rounded: {
    type: Boolean,
    default: true
  },
  dense: {
    type: Boolean,
    default: false
  },
  bannerClass: {
    type: String,
    default: ''
  },
  bannerStyle: {
    type: Object,
    default: () => ({})
  },
  color: {
    type: String,
    default: 'primary'
  },
  textColor: {
    type: String,
    default: 'white'
  },
  icon: {
    type: String,
    default: ''
  },
  actions: {
    type: Array,
    default: () => []
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  elevated: {
    type: Boolean,
    default: false
  },
  flat: {
    type: Boolean,
    default: false
  },
  bordered: {
    type: Boolean,
    default: false
  },
  square: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'default', // default, modern, glass, minimal
    validator: (value) => ['default', 'modern', 'glass', 'minimal'].includes(value)
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['close', 'timeout', 'click', 'dismiss'])

const visible = ref(true)
let timeoutId = null

// Настройки для разных типов уведомлений
const notificationConfig = {
  info: {
    icon: 'info',
    iconColor: 'blue',
    avatarColor: 'blue',
    bgColor: 'blue-1',
    textColor: 'blue-9'
  },
  success: {
    icon: 'check_circle',
    iconColor: 'green',
    avatarColor: 'green',
    bgColor: 'green-1',
    textColor: 'green-9'
  },
  warning: {
    icon: 'warning',
    iconColor: 'orange',
    avatarColor: 'orange',
    bgColor: 'orange-1',
    textColor: 'orange-9'
  },
  error: {
    icon: 'error',
    iconColor: 'red',
    avatarColor: 'red',
    bgColor: 'red-1',
    textColor: 'red-9'
  }
}

const config = computed(() => notificationConfig[props.type])

const icon = computed(() => config.value.icon)
const iconColor = computed(() => config.value.iconColor)
const avatarColor = computed(() => config.value.avatarColor)

const actions = computed(() => {
  if (!props.showCloseButton) return []
  return [
    {
      label: 'Закрыть',
      color: 'white',
      handler: close
    }
  ]
})

const close = () => {
  visible.value = false
  emit('close')
}

const startTimer = () => {
  if (props.persistent || props.duration <= 0) return

  timeoutId = setTimeout(() => {
    close()
    emit('timeout')
  }, props.duration)
}

const stopTimer = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

const handleClick = (event) => {
  emit('click', event)
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})

// Экспортируем методы для внешнего использования
defineExpose({
  close,
  show: () => { visible.value = true },
  isVisible: () => visible.value
})
</script>

<style lang="scss" scoped>
.common-notification {
  width: 100%;

  .common-notification-banner {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: slideInRight 0.3s ease-out;

    // Default variant
    &--default {
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    // Modern variant
    &--modern {
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
        border-radius: 16px 0 0 16px;
      }
    }

    // Glass variant
    &--glass {
      background: rgba(255, 255, 255, 0.1) !important;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    // Minimal variant
    &--minimal {
      border-radius: 8px;
      border: 1px solid currentColor;
      box-shadow: none;
      background: transparent !important;
    }

    // Type variations
    &--info {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;

      .q-banner__avatar {
        color: #93c5fd;
      }
    }

    &--success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;

      .q-banner__avatar {
        color: #6ee7b7;
      }
    }

    &--warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;

      .q-banner__avatar {
        color: #fcd34d;
      }
    }

    &--error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;

      .q-banner__avatar {
        color: #fca5a5;
      }
    }

    // Size variations
    &--sm {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;

      .q-banner__avatar {
        font-size: 1.25rem;
      }
    }

    &--md {
      padding: 1rem 1.5rem;
      font-size: 1rem;

      .q-banner__avatar {
        font-size: 1.5rem;
      }
    }

    &--lg {
      padding: 1.5rem 2rem;
      font-size: 1.125rem;

      .q-banner__avatar {
        font-size: 2rem;
      }
    }

    // Content styling
    .q-banner__content {
      display: flex;
      align-items: center;
      gap: 1rem;

      .q-banner__message {
        font-weight: 500;
        line-height: 1.6;
        flex: 1;
      }
    }

    // Avatar styling
    .q-banner__avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(4px);
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 0.2);
      }
    }

    // Actions styling
    .q-banner__actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .q-btn {
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }

    // Dismiss button
    .q-banner__dismiss {
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;

      &:hover {
        color: white;
        transform: rotate(90deg);
        background: rgba(255, 255, 255, 0.1);
      }
    }

    // Hover effects
    &:hover {
      transform: translateY(-2px);
      box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    // Clickable state
    &.clickable {
      cursor: pointer;

      &:active {
        transform: translateY(0);
        transition: transform 0.1s ease;
      }
    }

    // Progress bar for auto-dismiss
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      animation: progressBar 5s linear;
    }
  }
}

// Animations
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .common-notification-banner {
    &--glass {
      background: rgba(255, 255, 255, 0.05) !important;
      border-color: rgba(255, 255, 255, 0.1);
    }

    &--minimal {
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .common-notification-banner {
    border-radius: 8px;

    &--modern {
      border-radius: 12px;
    }

    .q-banner__content {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .q-banner__actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
}

// Toast positioning
.common-notification {
  &.toast-top-right {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 9999;
    max-width: 400px;
  }

  &.toast-top-left {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 9999;
    max-width: 400px;
  }

  &.toast-bottom-right {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 9999;
    max-width: 400px;
  }

  &.toast-bottom-left {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    z-index: 9999;
    max-width: 400px;
  }

  &.toast-center {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    max-width: 500px;
    width: 90%;
  }
}

// Stack multiple notifications
.notification-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .common-notification {
    animation: slideInRight 0.3s ease-out;

    &:nth-child(2) {
      animation-delay: 0.1s;
    }

    &:nth-child(3) {
      animation-delay: 0.2s;
    }
  }
}
</style>
