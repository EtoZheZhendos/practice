<template>
  <div class="common-form">
    <q-form
      ref="formRef"
      :class="formClass"
      @submit="handleSubmit"
      @reset="handleReset"
    >
      <slot />
    </q-form>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default', // default, modern, glass, minimal
    validator: (value) => ['default', 'modern', 'glass', 'minimal'].includes(value)
  },
  layout: {
    type: String,
    default: 'vertical', // vertical, horizontal, grid
    validator: (value) => ['vertical', 'horizontal', 'grid'].includes(value)
  },
  spacing: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['submit', 'reset'])

const formRef = ref(null)

const formClass = computed(() => {
  const baseClass = 'common-form'
  const variantClass = `common-form--${props.variant}`
  const layoutClass = `common-form--${props.layout}`
  const spacingClass = `common-form--${props.spacing}`

  return `${baseClass} ${variantClass} ${layoutClass} ${spacingClass}`
})

const handleSubmit = () => {
  emit('submit')
}

const handleReset = () => {
  emit('reset')
}

// Expose form methods
defineExpose({
  validate: () => formRef.value?.validate(),
  resetValidation: () => formRef.value?.resetValidation(),
  reset: () => formRef.value?.reset()
})
</script>

<style lang="scss" scoped>
.common-form {
  width: 100%;

  // Default variant
  &--default {
    .q-form {
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }

  // Modern variant
  &--modern {
    .q-form {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(226, 232, 240, 0.8);
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06),
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
  }

  // Glass variant
  &--glass {
    .q-form {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
  }

  // Minimal variant
  &--minimal {
    .q-form {
      background: transparent;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: none;
    }
  }

  // Layout variations
  &--vertical {
    .q-form {
      .form-row {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  }

  &--horizontal {
    .q-form {
      .form-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;

        .form-label {
          min-width: 120px;
          font-weight: 500;
          color: #4a5568;
        }

        .form-control {
          flex: 1;
        }
      }
    }
  }

  &--grid {
    .q-form {
      .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  }

  // Spacing variations
  &--sm {
    .q-form {
      padding: 1rem;

      .form-row {
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .form-group {
        gap: 0.25rem;
      }
    }
  }

  &--md {
    .q-form {
      padding: 2rem;

      .form-row {
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .form-group {
        gap: 0.5rem;
      }
    }
  }

  &--lg {
    .q-form {
      padding: 3rem;

      .form-row {
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .form-group {
        gap: 0.75rem;
      }
    }
  }

  // Form elements styling
  .q-form {
    position: relative;

    // Form title
    .form-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    // Form description
    .form-description {
      color: #718096;
      text-align: center;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    // Form sections
    .form-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: rgba(248, 250, 252, 0.5);
      border-radius: 8px;
      border: 1px solid rgba(226, 232, 240, 0.5);

      .section-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .section-icon {
          color: #667eea;
        }
      }
    }

    // Form actions
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(226, 232, 240, 0.5);

      .q-btn {
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        &.q-btn--flat {
          color: #718096;

          &:hover {
            background: rgba(113, 128, 150, 0.1);
          }
        }

        &.q-btn--unelevated {
          background: #667eea;
          color: white;

          &:hover {
            background: #5a67d8;
          }
        }
      }
    }

    // Form validation messages
    .form-error {
      color: #e53e3e;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .error-icon {
        color: #e53e3e;
      }
    }

    .form-success {
      color: #38a169;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .success-icon {
        color: #38a169;
      }
    }

    // Loading state
    &.form-loading {
      opacity: 0.7;
      pointer-events: none;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: inherit;
      }
    }
  }

  // Animation for form elements
  .q-form > * {
    animation: fadeInUp 0.3s ease-out;
    animation-fill-mode: both;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.1}s;
      }
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .common-form {
    &--default .q-form {
      background: #1a202c;
      color: #f7fafc;
    }

    &--modern .q-form {
      background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
      border-color: rgba(74, 85, 104, 0.8);
    }

    &--glass .q-form {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }

    &--minimal .q-form {
      border-color: #4a5568;
      color: #f7fafc;
    }

    .q-form {
      .form-title {
        color: #f7fafc;
      }

      .form-description {
        color: #a0aec0;
      }

      .form-section {
        background: rgba(45, 55, 72, 0.5);
        border-color: rgba(74, 85, 104, 0.5);

        .section-title {
          color: #f7fafc;
        }
      }

      .form-actions {
        border-top-color: rgba(74, 85, 104, 0.5);
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .common-form {
    &--horizontal .q-form {
      .form-row {
        flex-direction: column;
        align-items: stretch;

        .form-label {
          min-width: auto;
          margin-bottom: 0.5rem;
        }
      }
    }

    &--grid .q-form {
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    .q-form {
      padding: 1rem;

      .form-actions {
        flex-direction: column;

        .q-btn {
          width: 100%;
        }
      }
    }
  }
}

// Print styles
@media print {
  .common-form {
    .q-form {
      box-shadow: none !important;
      border: 1px solid #000 !important;
      background: white !important;
      color: black !important;
    }
  }
}
</style>
