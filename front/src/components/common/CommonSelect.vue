<template>
  <div class="common-select">
    <q-select
      v-model="selectValue"
      :options="options"
      :label="label"
      :placeholder="placeholder"
      :rules="rules"
      :error="!!error"
      :error-message="error"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :multiple="multiple"
      :use-chips="useChips"
      :use-counter="useCounter"
      :outlined="outlined"
      :filled="filled"
      :borderless="borderless"
      :standout="standout"
      :dense="dense"
      :autofocus="autofocus"
      :autocomplete="autocomplete"
      :class="selectClass"
      :option-label="optionLabel"
      :option-value="optionValue"
      :emit-value="emitValue"
      :map-options="mapOptions"
      @update:model-value="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <template v-if="$slots.prepend" #prepend>
        <slot name="prepend" />
      </template>

      <template v-if="$slots.append" #append>
        <slot name="append" />
      </template>

      <template v-if="$slots.before" #before>
        <slot name="before" />
      </template>

      <template v-if="$slots.after" #after>
        <slot name="after" />
      </template>

      <template v-if="$slots.selected" #selected>
        <slot name="selected" />
      </template>

      <template v-if="$slots.option" #option="scope">
        <slot name="option" v-bind="scope" />
      </template>

      <template v-if="$slots['no-option']" #no-option>
        <slot name="no-option" />
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object, null],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  rules: {
    type: Array,
    default: () => []
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  useChips: {
    type: Boolean,
    default: false
  },
  useCounter: {
    type: Boolean,
    default: false
  },
  outlined: {
    type: Boolean,
    default: true
  },
  filled: {
    type: Boolean,
    default: false
  },
  borderless: {
    type: Boolean,
    default: false
  },
  standout: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  selectClass: {
    type: String,
    default: ''
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  emitValue: {
    type: Boolean,
    default: true
  },
  mapOptions: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: 'default', // default, modern, glass, minimal
    validator: (value) => ['default', 'modern', 'glass', 'minimal'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'input'])

const selectValue = ref(props.modelValue)

// Синхронизация с внешним значением
watch(() => props.modelValue, (newValue) => {
  selectValue.value = newValue
})

watch(selectValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleInput = (value) => {
  emit('input', value)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}
</script>

<style lang="scss" scoped>
.common-select {
  width: 100%;
  position: relative;

  .q-field {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 12px;
    overflow: hidden;

    // Default variant
    &--default {
      .q-field__control {
        background: #ffffff;
        border: 2px solid #e2e8f0;
        transition: all 0.3s ease;

        &:hover {
          border-color: #cbd5e0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }

      &.q-field--focused .q-field__control {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
    }

    // Modern variant
    &--modern {
      .q-field__control {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border: 2px solid transparent;
        border-radius: 16px;
        box-shadow:
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);

        &:hover {
          box-shadow:
            0 8px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
        }
      }

      &.q-field--focused .q-field__control {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border-color: #667eea;
        box-shadow:
          0 0 0 3px rgba(102, 126, 234, 0.1),
          0 8px 15px -3px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 1);
      }
    }

    // Glass variant
    &--glass {
      .q-field__control {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

        &:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
      }

      &.q-field--focused .q-field__control {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(102, 126, 234, 0.5);
        box-shadow:
          0 0 0 3px rgba(102, 126, 234, 0.1),
          0 12px 40px rgba(0, 0, 0, 0.15);
      }
    }

    // Minimal variant
    &--minimal {
      .q-field__control {
        background: transparent;
        border: none;
        border-bottom: 2px solid #e2e8f0;
        border-radius: 0;
        padding: 8px 0;

        &:hover {
          border-bottom-color: #cbd5e0;
        }
      }

      &.q-field--focused .q-field__control {
        border-bottom-color: #667eea;
        box-shadow: 0 2px 0 rgba(102, 126, 234, 0.2);
      }
    }

    // Label styling
    .q-field__label {
      font-weight: 500;
      color: #4a5568;
      transition: all 0.3s ease;
    }

    &.q-field--focused .q-field__label {
      color: #667eea;
      font-weight: 600;
    }

    // Input styling
    .q-field__native {
      font-size: 1rem;
      color: #2d3748;
      font-weight: 500;

      &::placeholder {
        color: #a0aec0;
        font-weight: 400;
      }
    }

    // Dropdown arrow
    .q-field__append {
      .q-icon {
        color: #718096;
        transition: all 0.3s ease;
      }
    }

    &.q-field--focused .q-field__append .q-icon {
      color: #667eea;
      transform: rotate(180deg);
    }

    // Chips styling (for multiple selection)
    .q-chip {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 20px;
      font-weight: 500;
      margin: 2px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .q-chip__remove {
        color: white;
        opacity: 0.8;

        &:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }

    // Error state
    &.q-field--error {
      .q-field__control {
        border-color: #e53e3e;
        box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
      }

      .q-field__label {
        color: #e53e3e;
      }
    }

    // Disabled state
    &.q-field--disabled {
      opacity: 0.6;

      .q-field__control {
        background: #f7fafc;
        cursor: not-allowed;
      }
    }
  }

  // Dropdown menu styling
  .q-menu {
    background: #ffffff;
    border-radius: 12px;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
    overflow: hidden;

    .q-item {
      padding: 0.75rem 1rem;
      color: #2d3748;
      font-weight: 500;
      transition: all 0.3s ease;
      border-bottom: 1px solid rgba(226, 232, 240, 0.3);

      &:hover {
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
      }

      &.q-item--active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    // No options message
    .q-item--no-option {
      color: #718096;
      font-style: italic;
      text-align: center;
      padding: 2rem 1rem;
    }
  }

  // Floating label animation
  .q-field--float .q-field__label {
    transform: translateY(-1.5rem) scale(0.85);
    background: #ffffff;
    padding: 0 4px;
    border-radius: 4px;
  }

  // Focus ring animation
  .q-field--focused::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    pointer-events: none;
    animation: focusRing 0.3s ease-out;
  }
}

@keyframes focusRing {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .common-select {
    .q-field {
      &--modern .q-field__control {
        background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
        border-color: #4a5568;

        &:hover {
          background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
        }
      }

      &--glass .q-field__control {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .q-field__label {
        color: #e2e8f0;
      }

      .q-field__native {
        color: #f7fafc;

        &::placeholder {
          color: #718096;
        }
      }
    }

    .q-menu {
      background: #1a202c;
      border-color: rgba(74, 85, 104, 0.8);

      .q-item {
        color: #f7fafc;
        border-bottom-color: rgba(74, 85, 104, 0.3);

        &:hover {
          background: rgba(102, 126, 234, 0.2);
        }

        &.q-item--no-option {
          color: #a0aec0;
        }
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .common-select {
    .q-field {
      border-radius: 8px;

      &--modern .q-field__control {
        border-radius: 12px;
      }

      .q-field__native {
        font-size: 0.875rem;
      }
    }

    .q-menu {
      border-radius: 8px;

      .q-item {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
      }
    }
  }
}

// Animation for dropdown
.q-menu {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
