<template>
  <q-btn
    :label="label"
    :icon="icon"
    :icon-right="iconRight"
    :color="color"
    :text-color="textColor"
    :flat="flat"
    :outline="outline"
    :round="round"
    :unelevated="unelevated"
    :no-caps="noCaps"
    :no-wrap="noWrap"
    :dense="dense"
    :size="size"
    :loading="loading"
    :disable="disabled"
    :class="buttonClass"
    :style="buttonStyle"
    @click="handleClick"
    @dblclick="handleDblClick"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>

    <template v-if="$slots.loading" #loading>
      <slot name="loading" />
    </template>
  </q-btn>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: null
  },
  iconRight: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: 'primary'
  },
  textColor: {
    type: String,
    default: null
  },
  flat: {
    type: Boolean,
    default: false
  },
  outline: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  unelevated: {
    type: Boolean,
    default: false
  },
  noCaps: {
    type: Boolean,
    default: false
  },
  noWrap: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  buttonClass: {
    type: String,
    default: ''
  },
  buttonStyle: {
    type: Object,
    default: () => ({})
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'gradient', 'glass', 'modern', 'outline'].includes(value)
  }
})

const emit = defineEmits(['click', 'dblclick'])

const buttonClass = computed(() => {
  const baseClass = 'common-button'
  const variantClass = `common-button--${props.variant}`
  return `${baseClass} ${variantClass}`
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const handleDblClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('dblclick', event)
  }
}
</script>

<style lang="scss" scoped>
.common-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  letter-spacing: 0.025em;
  border-radius: 12px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(1px);
  }

  // Default variant
  &--default {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    &:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }
  }

  // Gradient variant
  &--gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

    &:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
      transform: translateY(-3px);
    }

    &:active {
      transform: translateY(-1px);
    }
  }

  // Glass variant
  &--glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  }

  // Modern variant
  &--modern {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
      transform: translateY(-3px);
    }

    &:active {
      transform: translateY(-1px);
    }
  }

  // Outline variant
  &--outline {
    background: transparent;
    border: 2px solid currentColor;
    color: inherit;
    box-shadow: none;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  // Size variations
  &.q-btn--sm {
    padding: 8px 16px;
    font-size: 0.875rem;
  }

  &.q-btn--md {
    padding: 12px 24px;
    font-size: 1rem;
  }

  &.q-btn--lg {
    padding: 16px 32px;
    font-size: 1.125rem;
  }

  // Loading state
  &.q-btn--loading {
    pointer-events: none;
    opacity: 0.8;
  }

  // Disabled state
  &.q-btn--disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      transform: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .common-button {
    &--glass {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
