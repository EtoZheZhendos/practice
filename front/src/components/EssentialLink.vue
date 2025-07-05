<template>
  <q-item
    :class="linkClass"
    :active="active"
    :clickable="clickable"
    :dense="dense"
    :inset-level="insetLevel"
    :tag="tag"
    @click="handleClick"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" :class="iconClass" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="labelClass">{{ title }}</q-item-label>
      <q-item-label v-if="caption" caption :class="captionClass">
        {{ caption }}
      </q-item-label>
    </q-item-section>

    <q-item-section v-if="rightIcon" side>
      <q-icon :name="rightIcon" :class="rightIconClass" />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  rightIcon: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: '#'
  },
  active: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: true
  },
  dense: {
    type: Boolean,
    default: false
  },
  insetLevel: {
    type: Number,
    default: 0
  },
  tag: {
    type: String,
    default: 'div'
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

const emit = defineEmits(['click'])

const linkClass = computed(() => {
  const baseClass = 'essential-link'
  const variantClass = `essential-link--${props.variant}`
  const sizeClass = `essential-link--${props.size}`
  const activeClass = props.active ? 'essential-link--active' : ''

  return `${baseClass} ${variantClass} ${sizeClass} ${activeClass}`
})

const iconClass = computed(() => {
  return `essential-link__icon essential-link__icon--${props.variant}`
})

const labelClass = computed(() => {
  return `essential-link__label essential-link__label--${props.variant}`
})

const captionClass = computed(() => {
  return `essential-link__caption essential-link__caption--${props.variant}`
})

const rightIconClass = computed(() => {
  return `essential-link__right-icon essential-link__right-icon--${props.variant}`
})

const handleClick = (event) => {
  emit('click', event)
}
</script>

<style lang="scss" scoped>
.essential-link {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  margin: 0.25rem 0;
  overflow: hidden;

  // Default variant
  &--default {
    background: transparent;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateX(4px);
    }

    &.essential-link--active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  }

  // Modern variant
  &--modern {
    background: rgba(248, 250, 252, 0.5);
    border: 1px solid transparent;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      border-color: rgba(102, 126, 234, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
    }

    &.essential-link--active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 0 2px 2px 0;
      }
    }
  }

  // Glass variant
  &--glass {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    &.essential-link--active {
      background: rgba(102, 126, 234, 0.2);
      border-color: rgba(102, 126, 234, 0.5);
      color: white;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
    }
  }

  // Minimal variant
  &--minimal {
    background: transparent;
    border: none;

    &:hover {
      background: rgba(102, 126, 234, 0.05);
      border-left: 3px solid #667eea;
      padding-left: 1rem;
    }

    &.essential-link--active {
      background: rgba(102, 126, 234, 0.1);
      border-left: 3px solid #667eea;
      color: #667eea;
      font-weight: 600;
    }
  }

  // Size variations
  &--sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;

    .essential-link__icon {
      font-size: 1.25rem;
    }
  }

  &--md {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;

    .essential-link__icon {
      font-size: 1.5rem;
    }
  }

  // Icon styling
  &__icon {
    transition: all 0.3s ease;

    &--default {
      color: #718096;
    }

    &--modern {
      color: #4a5568;
    }

    &--glass {
      color: rgba(255, 255, 255, 0.8);
    }

    &--minimal {
      color: #718096;
    }
  }

  // Label styling
  &__label {
    font-weight: 500;
    transition: all 0.3s ease;

    &--default {
      color: #2d3748;
    }

    &--modern {
      color: #2d3748;
    }

    &--glass {
      color: rgba(255, 255, 255, 0.9);
    }

    &--minimal {
      color: #2d3748;
    }
  }

  // Caption styling
  &__caption {
    transition: all 0.3s ease;

    &--default {
      color: #718096;
    }

    &--modern {
      color: #718096;
    }

    &--glass {
      color: rgba(255, 255, 255, 0.7);
    }

    &--minimal {
      color: #a0aec0;
    }
  }

  // Right icon styling
  &__right-icon {
    transition: all 0.3s ease;

    &--default {
      color: #cbd5e0;
    }

    &--modern {
      color: #cbd5e0;
    }

    &--glass {
      color: rgba(255, 255, 255, 0.6);
    }

    &--minimal {
      color: #cbd5e0;
    }
  }

  // Active state overrides
  &.essential-link--active {
    .essential-link__icon {
      color: white;
    }

    .essential-link__label {
      color: white;
      font-weight: 600;
    }

    .essential-link__caption {
      color: rgba(255, 255, 255, 0.8);
    }

    .essential-link__right-icon {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  // Hover effects for icons
  &:hover {
    .essential-link__icon {
      transform: scale(1.1);
    }

    .essential-link__right-icon {
      transform: translateX(4px);
    }
  }

  // Ripple effect
  &::after {
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

  &:active::after {
    width: 300px;
    height: 300px;
  }

  // Clickable state
  &.clickable {
    cursor: pointer;

    &:active {
      transform: translateY(0);
      transition: transform 0.1s ease;
    }
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .essential-link {
    &--modern {
      background: rgba(45, 55, 72, 0.5);

      &:hover {
        background: rgba(102, 126, 234, 0.2);
      }
    }

    &--glass {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }

    &__label {
      &--default,
      &--modern,
      &--minimal {
        color: #f7fafc;
      }
    }

    &__caption {
      &--default,
      &--modern,
      &--minimal {
        color: #a0aec0;
      }
    }

    &__icon {
      &--default,
      &--modern,
      &--minimal {
        color: #a0aec0;
      }
    }

    &__right-icon {
      &--default,
      &--modern,
      &--minimal {
        color: #718096;
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .essential-link {
    border-radius: 8px;
    margin: 0.125rem 0;

    &--sm,
    &--md {
      padding: 0.75rem 1rem;
    }

    .essential-link__icon {
      font-size: 1.25rem;
    }
  }
}

// Animation for link appearance
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.essential-link {
  animation: slideInLeft 0.3s ease-out;
  animation-fill-mode: both;

  @for $i from 1 through 20 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.05}s;
    }
  }
}
</style>
