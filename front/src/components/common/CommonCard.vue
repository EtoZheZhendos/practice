<template>
  <q-card
    :class="cardClass"
    :style="cardStyle"
    :flat="flat"
    :bordered="bordered"
    :square="square"
    :elevated="elevated"
    :clickable="clickable"
    @click="handleClick"
  >
    <!-- Header -->
    <q-card-section v-if="showHeader" class="q-pb-none">
      <div class="row items-center">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <slot name="header-actions" />
      </div>
      <div v-if="subtitle" class="text-subtitle2 text-grey-6 q-mt-sm">
        {{ subtitle }}
      </div>
    </q-card-section>

    <!-- Image -->
    <q-img
      v-if="image"
      :src="image"
      :alt="imageAlt"
      :ratio="imageRatio"
      :spinner-color="spinnerColor"
      :spinner-size="spinnerSize"
    />

    <!-- Content -->
    <q-card-section class="q-pt-none">
      <slot />
    </q-card-section>

    <!-- Actions -->
    <q-card-actions v-if="showActions" align="right" class="q-pa-md">
      <slot name="actions" />
    </q-card-actions>

    <!-- Footer -->
    <q-card-section v-if="showFooter" class="q-pt-none">
      <slot name="footer" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: null
  },
  imageAlt: {
    type: String,
    default: ''
  },
  imageRatio: {
    type: Number,
    default: 16/9
  },
  spinnerColor: {
    type: String,
    default: 'primary'
  },
  spinnerSize: {
    type: String,
    default: '28px'
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: false
  },
  showFooter: {
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
  elevated: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'default', // default, modern, glass, gradient, minimal
    validator: (value) => ['default', 'modern', 'glass', 'gradient', 'minimal'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  cardClass: {
    type: String,
    default: ''
  },
  cardStyle: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['click'])

const cardClass = computed(() => {
  const baseClass = 'common-card'
  const variantClass = `common-card--${props.variant}`
  const hoverClass = props.hover ? 'common-card--hover' : ''
  const clickableClass = props.clickable ? 'common-card--clickable' : ''

  return `${baseClass} ${variantClass} ${hoverClass} ${clickableClass}`
})

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
.common-card {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  // Default variant
  &--default {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    &.common-card--hover:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }
  }

  // Modern variant
  &--modern {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 16px;
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);

    &.common-card--hover:hover {
      background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
      box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      transform: translateY(-4px);
    }

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
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    &.common-card--hover:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  }

  // Gradient variant
  &--gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    color: white;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);

    &.common-card--hover:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
      transform: translateY(-3px);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
      border-radius: inherit;
      pointer-events: none;
    }
  }

  // Minimal variant
  &--minimal {
    background: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: none;

    &.common-card--hover:hover {
      border-color: #cbd5e0;
      background: rgba(248, 250, 252, 0.5);
    }
  }

  // Clickable state
  &--clickable {
    cursor: pointer;

    &:active {
      transform: translateY(0);
      transition: transform 0.1s ease;
    }
  }

  // Content styling
  .q-card__section {
    position: relative;
    z-index: 1;
  }

  // Header styling
  .q-card__section--vert {
    border-bottom: 1px solid rgba(226, 232, 240, 0.5);

    .q-card__title {
      font-weight: 600;
      color: #2d3748;
      font-size: 1.25rem;
    }

    .q-card__subtitle {
      color: #718096;
      font-weight: 500;
    }
  }

  // Body styling
  .q-card__section--vert:not(:first-child) {
    padding: 1.5rem;
  }

  // Actions styling
  .q-card__actions {
    border-top: 1px solid rgba(226, 232, 240, 0.5);
    padding: 1rem 1.5rem;
    background: rgba(248, 250, 252, 0.5);
  }

  // Ripple effect for clickable cards
  &--clickable::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &--clickable:active::after {
    width: 300px;
    height: 300px;
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .common-card {
    &--default {
      background: #1a202c;
      color: #f7fafc;
    }

    &--modern {
      background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
      border-color: rgba(74, 85, 104, 0.8);

      &.common-card--hover:hover {
        background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
      }
    }

    &--glass {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }

    &--minimal {
      border-color: #4a5568;
      color: #f7fafc;

      &.common-card--hover:hover {
        border-color: #718096;
        background: rgba(45, 55, 72, 0.5);
      }
    }

    .q-card__section--vert {
      border-bottom-color: rgba(74, 85, 104, 0.5);

      .q-card__title {
        color: #f7fafc;
      }

      .q-card__subtitle {
        color: #a0aec0;
      }
    }

    .q-card__actions {
      border-top-color: rgba(74, 85, 104, 0.5);
      background: rgba(45, 55, 72, 0.5);
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .common-card {
    border-radius: 8px;

    &--modern {
      border-radius: 12px;
    }

    .q-card__section--vert:not(:first-child) {
      padding: 1rem;
    }

    .q-card__actions {
      padding: 0.75rem 1rem;
    }
  }
}
</style>
