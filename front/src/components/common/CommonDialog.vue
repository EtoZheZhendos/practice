<template>
  <q-dialog
    v-model="isVisible"
    :persistent="persistent"
    :maximized="maximized"
    :full-width="fullWidth"
    :full-height="fullHeight"
    :transition-show="transitionShow"
    :transition-hide="transitionHide"
    :no-esc-dismiss="noEscDismiss"
    :no-backdrop-dismiss="noBackdropDismiss"
    :no-route-dismiss="noRouteDismiss"
    :no-refocus="noRefocus"
    :auto-close="autoClose"
    :seamless="seamless"
    :square="square"
    :class="dialogClass"
    @before-show="onBeforeShow"
    @show="onShow"
    @before-hide="onBeforeHide"
    @hide="onHide"
  >
    <q-card :class="cardClass">
      <!-- Header -->
      <q-card-section v-if="title || $slots.header" class="dialog-header">
        <div class="dialog-header-content">
          <h3 v-if="title" class="dialog-title">{{ title }}</h3>
          <slot name="header" />
          <q-btn
            v-if="showCloseButton"
            flat
            round
            dense
            icon="close"
            class="dialog-close-btn"
            @click="close"
          />
        </div>
      </q-card-section>

      <!-- Body -->
      <q-card-section class="dialog-body">
        <slot />
      </q-card-section>

      <!-- Footer -->
      <q-card-actions v-if="$slots.footer" class="dialog-footer">
        <slot name="footer" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  persistent: {
    type: Boolean,
    default: false
  },
  maximized: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  fullHeight: {
    type: Boolean,
    default: false
  },
  transitionShow: {
    type: String,
    default: 'scale'
  },
  transitionHide: {
    type: String,
    default: 'scale'
  },
  noEscDismiss: {
    type: Boolean,
    default: false
  },
  noBackdropDismiss: {
    type: Boolean,
    default: false
  },
  noRouteDismiss: {
    type: Boolean,
    default: false
  },
  noRefocus: {
    type: Boolean,
    default: false
  },
  autoClose: {
    type: Boolean,
    default: false
  },
  seamless: {
    type: Boolean,
    default: false
  },
  square: {
    type: Boolean,
    default: false
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: 'default', // default, modern, glass, minimal
    validator: (value) => ['default', 'modern', 'glass', 'minimal'].includes(value)
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'before-show', 'show', 'before-hide', 'hide'])

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const dialogClass = computed(() => {
  const baseClass = 'common-dialog'
  const variantClass = `common-dialog--${props.variant}`
  const sizeClass = `common-dialog--${props.size}`

  return `${baseClass} ${variantClass} ${sizeClass}`
})

const cardClass = computed(() => {
  const baseClass = 'common-dialog-card'
  const variantClass = `common-dialog-card--${props.variant}`

  return `${baseClass} ${variantClass}`
})

const close = () => {
  isVisible.value = false
}

const onBeforeShow = () => {
  emit('before-show')
}

const onShow = () => {
  emit('show')
}

const onBeforeHide = () => {
  emit('before-hide')
}

const onHide = () => {
  emit('hide')
}
</script>

<style lang="scss" scoped>
.common-dialog {
  // Default variant
  &--default {
    .q-dialog__backdrop {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
    }
  }

  // Modern variant
  &--modern {
    .q-dialog__backdrop {
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
    }
  }

  // Glass variant
  &--glass {
    .q-dialog__backdrop {
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(12px);
    }
  }

  // Minimal variant
  &--minimal {
    .q-dialog__backdrop {
      background: rgba(0, 0, 0, 0.4);
    }
  }

  // Size variations
  &--sm .q-dialog__inner--minimized > div {
    max-width: 400px;
  }

  &--md .q-dialog__inner--minimized > div {
    max-width: 600px;
  }

  &--lg .q-dialog__inner--minimized > div {
    max-width: 800px;
  }

  &--xl .q-dialog__inner--minimized > div {
    max-width: 1200px;
  }
}

.common-dialog-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // Default variant
  &--default {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  // Modern variant
  &--modern {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 16px;
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px 16px 0 0;
    }
  }

  // Glass variant
  &--glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  // Minimal variant
  &--minimal {
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  // Header styling
  .dialog-header {
    background: rgba(248, 250, 252, 0.8);
    border-bottom: 1px solid rgba(226, 232, 240, 0.5);
    padding: 1.5rem;

    .dialog-header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .dialog-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #2d3748;
        line-height: 1.2;
      }

      .dialog-close-btn {
        color: #718096;
        transition: all 0.3s ease;

        &:hover {
          color: #e53e3e;
          transform: rotate(90deg);
          background: rgba(229, 62, 62, 0.1);
        }
      }
    }
  }

  // Body styling
  .dialog-body {
    padding: 1.5rem;
    color: #f7fafc !important;
    line-height: 1.6;

    // Form elements styling
    .q-field {
      margin-bottom: 1rem;
    }

    .q-field__label,
    .q-field__native,
    .q-field__control,
    .q-field__marginal,
    .q-field__bottom,
    .q-field__prefix,
    .q-field__suffix,
    .q-field__prepend,
    .q-field__append,
    .q-icon,
    .q-placeholder,
    .q-select__dropdown-icon,
    .q-select__input {
      color: #f7fafc !important;
      fill: #f7fafc !important;
      opacity: 1 !important;
    }

    input,
    textarea {
      color: #f7fafc !important;
      background: transparent !important;
      caret-color: #fff !important;
    }

    .q-placeholder {
      color: #b3b8c5 !important;
      opacity: 1 !important;
    }

    ::placeholder {
      color: #b3b8c5 !important;
      opacity: 1 !important;
    }

    // Ошибки
    .q-field__bottom {
      color: #f87171 !important;
      font-size: 0.85em;
      margin-top: 2px;
      margin-bottom: 0;
      position: relative;
      left: 0;
      white-space: normal;
      max-width: 100%;
      overflow: visible;
    }
    .q-field--error .q-field__control {
      border-color: #f87171 !important;
      box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.2);
    }
  }

  // Footer styling
  .dialog-footer {
    background: rgba(248, 250, 252, 0.8);
    border-top: 1px solid rgba(226, 232, 240, 0.5);
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;

    .q-btn {
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      min-width: 120px;
      padding: 0.5rem 1.5rem;
    }

    .q-btn--unelevated {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%) !important;
      color: #fff !important;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
      border: none;
    }

    .q-btn--flat {
      color: #fff !important;
      background: rgba(255,255,255,0.08) !important;
      &:hover {
        background: rgba(255,255,255,0.18) !important;
      }
    }
  }

  // Animation for dialog content
  .q-card__section {
    animation: slideInUp 0.3s ease-out;
  }

  .dialog-footer {
    animation: slideInUp 0.3s ease-out 0.1s both;
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .common-dialog-card {
    &--default {
      background: #1a202c;
      color: #f7fafc;
    }

    &--modern {
      background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
      border-color: rgba(74, 85, 104, 0.8);
    }

    &--glass {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }

    &--minimal {
      background: #1a202c;
      border-color: #4a5568;
      color: #f7fafc;
    }

    .dialog-header {
      background: rgba(45, 55, 72, 0.8);
      border-bottom-color: rgba(74, 85, 104, 0.5);

      .dialog-header-content .dialog-title {
        color: #f7fafc;
      }
    }

    .dialog-body {
      color: #f7fafc;
    }

    .dialog-footer {
      background: rgba(45, 55, 72, 0.8);
      border-top-color: rgba(74, 85, 104, 0.5);
    }
  }
}

// Animations
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// Responsive design
@media (max-width: 768px) {
  .common-dialog {
    &--sm .q-dialog__inner--minimized > div,
    &--md .q-dialog__inner--minimized > div,
    &--lg .q-dialog__inner--minimized > div,
    &--xl .q-dialog__inner--minimized > div {
      max-width: 95vw;
      margin: 1rem;
    }
  }

  .common-dialog-card {
    border-radius: 8px;

    .dialog-header {
      padding: 1rem;

      .dialog-header-content .dialog-title {
        font-size: 1.25rem;
      }
    }

    .dialog-body {
      padding: 1rem;
    }

    .dialog-footer {
      padding: 0.75rem 1rem;
      flex-direction: column;

      .q-btn {
        width: 100%;
        margin-bottom: 0.5rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// Custom transitions
.q-dialog__inner--minimized > div {
  animation: scaleIn 0.3s ease-out;
}

// Focus management
.common-dialog:focus-within {
  outline: none;
}

// Accessibility improvements
.common-dialog[aria-modal="true"] {
  z-index: 2000;
}

// Print styles
@media print {
  .common-dialog {
    position: static !important;

    .q-dialog__backdrop {
      display: none !important;
    }

    .common-dialog-card {
      box-shadow: none !important;
      border: 1px solid #000 !important;
    }
  }
}
</style>
