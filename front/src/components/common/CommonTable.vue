<template>
  <div class="common-table">
    <!-- Search and Filters -->
    <div v-if="showSearch || showFilters" class="q-mb-md">
      <div class="row q-gutter-md">
        <!-- Search -->
        <div v-if="showSearch" class="col-12 col-md-4">
          <q-input
            v-model="searchText"
            :placeholder="searchPlaceholder"
            dense
            outlined
            clearable
            @update:model-value="handleSearch"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- Filters -->
        <div v-if="showFilters" class="col-12 col-md-8">
          <slot name="filters" />
        </div>
      </div>
    </div>

    <!-- Table -->
    <q-table
      :rows="filteredRows"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      :rows-per-page-options="rowsPerPageOptions"
      :selection="selection"
      :selected="selected"
      :binary-state-sort="binaryStateSort"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :row-key="rowKey"
      :class="tableClass"
      :style="tableStyle"
      @request="handleRequest"
      @selection="handleSelection"
      @row-click="handleRowClick"
    >
      <!-- Custom slots for columns -->
      <template v-for="column in columns" :key="column.name" #[`body-cell-${column.name}`]="props">
        <slot :name="`cell-${column.name}`" v-bind="props">
          <q-td :props="props">
            {{ props.value }}
          </q-td>
        </slot>
      </template>

      <!-- Actions column -->
      <template #body-cell-actions="props">
        <q-td :props="props">
          <slot name="actions" v-bind="props">
            <q-btn
              v-if="showEditButton"
              icon="edit"
              size="sm"
              flat
              round
              dense
              color="primary"
              @click="handleEdit(props.row)"
            />
            <q-btn
              v-if="showDeleteButton"
              icon="delete"
              size="sm"
              flat
              round
              dense
              color="negative"
              @click="handleDelete(props.row)"
            />
          </slot>
        </q-td>
      </template>

      <!-- Empty state -->
      <template #no-data>
        <slot name="no-data">
          <div class="full-width row flex-center q-pa-md">
            <q-icon name="inbox" size="2rem" color="grey-4" />
            <span class="q-ml-sm text-grey-6">Нет данных</span>
          </div>
        </slot>
      </template>

      <!-- Loading state -->
      <template #loading>
        <slot name="loading">
          <q-inner-loading showing color="primary" />
        </slot>
      </template>
    </q-table>

    <!-- Pagination info -->
    <div v-if="showPaginationInfo" class="q-mt-sm text-caption text-grey-6">
      Показано {{ pagination.rowsNumber }} из {{ totalRows }} записей
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  rows: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  searchText: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: 'Поиск...'
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  showFilters: {
    type: Boolean,
    default: false
  },
  showEditButton: {
    type: Boolean,
    default: true
  },
  showDeleteButton: {
    type: Boolean,
    default: true
  },
  showPaginationInfo: {
    type: Boolean,
    default: true
  },
  selection: {
    type: String,
    default: 'none',
    validator: (value) => ['none', 'single', 'multiple'].includes(value)
  },
  selected: {
    type: Array,
    default: () => []
  },
  binaryStateSort: {
    type: Boolean,
    default: false
  },
  sortBy: {
    type: String,
    default: null
  },
  sortDesc: {
    type: Boolean,
    default: false
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  tableClass: {
    type: String,
    default: ''
  },
  tableStyle: {
    type: Object,
    default: () => ({})
  },
  rowsPerPageOptions: {
    type: Array,
    default: () => [10, 25, 50, 100]
  },
  pagination: {
    type: Object,
    default: () => ({
      sortBy: null,
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    })
  }
})

const emit = defineEmits([
  'update:searchText',
  'search',
  'request',
  'selection',
  'edit',
  'delete',
  'row-click'
])

const searchText = ref(props.searchText)

// Синхронизация с внешним значением
watch(() => props.searchText, (newValue) => {
  searchText.value = newValue
})

watch(searchText, (newValue) => {
  emit('update:searchText', newValue)
})

// Используем переданные строки без дополнительной фильтрации
const filteredRows = computed(() => props.rows)

// Общее количество строк
const totalRows = computed(() => props.rows.length)

const handleSearch = (value) => {
  searchText.value = value
  emit('search', value)
}

const handleRequest = (request) => {
  emit('request', request)
}

const handleSelection = (selection) => {
  emit('selection', selection)
}

const handleEdit = (row) => {
  emit('edit', row)
}

const handleDelete = (row) => {
  emit('delete', row)
}

const handleRowClick = (evt, row) => {
  emit('row-click', row)
}
</script>

<style lang="scss" scoped>
.common-table {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // Default variant
  &--default {
    background: #ffffff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  // Modern variant
  &--modern {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }

  // Glass variant
  &--glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  // Minimal variant
  &--minimal {
    background: transparent;
    border: 1px solid #e2e8f0;
    box-shadow: none;
  }

  // Glass dark variant
  &--darkglass {
    background: rgba(30, 32, 48, 0.55) !important;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
    .q-table,
    .q-table__container,
    .q-table th,
    .q-table td {
      background: transparent !important;
      color: #f1f1f1 !important;
      border-color: rgba(255,255,255,0.08) !important;
    }
    .q-table,
    .q-table__container {
      border-radius: 16px;
      box-shadow: none;
      overflow: hidden;
    }
    .q-table th {
      color: #b3b8c5 !important;
      font-weight: 600;
      font-size: 1rem;
      background: rgba(255,255,255,0.03) !important;
      border-bottom: 1px solid rgba(255,255,255,0.08) !important;
    }
    .q-table td {
      color: #f1f1f1 !important;
    }
    .q-table tbody tr {
      transition: background 0.2s;
    }
    .q-table tbody tr:hover {
      background: rgba(255,255,255,0.04) !important;
    }
    .q-table__bottom,
    .q-table__top {
      background: transparent !important;
      color: #b3b8c5 !important;
    }
    .q-table__pagination .q-btn,
    .q-table__pagination .q-btn--flat {
      background: rgba(255,255,255,0.08) !important;
      color: #fff !important;
      border-radius: 8px;
      margin: 0 2px;
      transition: background 0.2s;
    }
    .q-table__pagination .q-btn:hover {
      background: rgba(255,255,255,0.18) !important;
    }
    .q-table__top .q-field {
      background: rgba(255,255,255,0.08) !important;
      border-radius: 8px;
      color: #fff !important;
    }
    .q-table__top .q-field__control,
    .q-table__top input {
      color: #fff !important;
    }
  }

  // Table styling
  .q-table {
    background: transparent;

    // Header styling
    .q-table__top {
      background: rgba(248, 250, 252, 0.8);
      border-bottom: 1px solid rgba(226, 232, 240, 0.5);
      padding: 1rem 1.5rem;

      .q-table__title {
        font-weight: 600;
        color: #2d3748;
        font-size: 1.25rem;
      }

      .q-table__subtitle {
        color: #718096;
        font-weight: 500;
      }
    }

    // Table header
    .q-table thead th {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      color: #4a5568;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #e2e8f0;
      padding: 1rem;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        color: #2d3748;
      }

      &.sortable {
        cursor: pointer;

        &:hover {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
        }
      }

      .q-table__sort-icon {
        color: #667eea;
        transition: all 0.3s ease;
      }
    }

    // Table body
    .q-table tbody tr {
      transition: all 0.3s ease;
      border-bottom: 1px solid rgba(226, 232, 240, 0.3);

      &:hover {
        background: rgba(102, 126, 234, 0.05);
        transform: translateX(4px);
      }

      // Striped rows
      &:nth-child(even) {
        background: rgba(248, 250, 252, 0.5);
      }

      // Selected row
      &.selected {
        background: rgba(102, 126, 234, 0.1);
        border-left: 4px solid #667eea;
      }
    }

    // Table cells
    .q-table tbody td {
      padding: 1rem;
      color: #2d3748;
      font-weight: 500;
      border-bottom: 1px solid rgba(226, 232, 240, 0.2);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(102, 126, 234, 0.05);
      }
    }

    // Actions column
    .q-table tbody td:last-child {
      text-align: center;

      .q-btn {
        margin: 0 0.25rem;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }
    }

    // Status badges
    .q-badge {
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;

      &.status-pending {
        background: #fed7d7;
        color: #c53030;
      }

      &.status-in_progress {
        background: #bee3f8;
        color: #2b6cb0;
      }

      &.status-completed {
        background: #c6f6d5;
        color: #2f855a;
      }

      &.status-cancelled {
        background: #fed7d7;
        color: #c53030;
      }
    }

    // Priority indicators
    .priority-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 0.5rem;

      &.priority-low {
        background: #48bb78;
      }

      &.priority-medium {
        background: #ed8936;
      }

      &.priority-high {
        background: #e53e3e;
      }

      &.priority-critical {
        background: #805ad5;
      }
    }

    // Bottom section
    .q-table__bottom {
      background: rgba(248, 250, 252, 0.8);
      border-top: 1px solid rgba(226, 232, 240, 0.5);
      padding: 1rem 1.5rem;

      .q-table__control {
        color: #4a5568;
      }
    }

    // Pagination
    .q-pagination {
      .q-btn {
        border-radius: 8px;
        margin: 0 0.25rem;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        &.q-btn--active {
          background: #667eea;
          color: white;
        }
      }
    }

    // Loading state
    .q-table__loading {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(4px);

      .q-spinner {
        color: #667eea;
      }
    }

    // No data state
    .q-table__no-data {
      padding: 3rem 1.5rem;
      text-align: center;
      color: #718096;

      .q-icon {
        font-size: 3rem;
        color: #cbd5e0;
        margin-bottom: 1rem;
      }
    }
  }

  // Hover effects
  &--hover .q-table tbody tr:hover {
    background: rgba(102, 126, 234, 0.08);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  // Striped rows
  &--striped .q-table tbody tr:nth-child(even) {
    background: rgba(248, 250, 252, 0.8);
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .common-table {
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
      border-color: #4a5568;
      color: #f7fafc;
    }

    .q-table {
      .q-table__top {
        background: rgba(45, 55, 72, 0.8);
        border-bottom-color: rgba(74, 85, 104, 0.5);

        .q-table__title {
          color: #f7fafc;
        }

        .q-table__subtitle {
          color: #a0aec0;
        }
      }

      .q-table thead th {
        background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
        color: #e2e8f0;
        border-bottom-color: #4a5568;

        &:hover {
          background: linear-gradient(135deg, #4a5568 0%, #718096 100%);
          color: #f7fafc;
        }
      }

      .q-table tbody tr {
        border-bottom-color: rgba(74, 85, 104, 0.3);

        &:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        &:nth-child(even) {
          background: rgba(45, 55, 72, 0.5);
        }
      }

      .q-table tbody td {
        color: #f7fafc;
        border-bottom-color: rgba(74, 85, 104, 0.2);
      }

      .q-table__bottom {
        background: rgba(45, 55, 72, 0.8);
        border-top-color: rgba(74, 85, 104, 0.5);

        .q-table__control {
          color: #e2e8f0;
        }
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .common-table {
    border-radius: 8px;

    .q-table {
      .q-table__top {
        padding: 0.75rem 1rem;
      }

      .q-table thead th,
      .q-table tbody td {
        padding: 0.75rem;
        font-size: 0.875rem;
      }

      .q-table__bottom {
        padding: 0.75rem 1rem;
      }
    }
  }
}

// Animation for table rows
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

.common-table .q-table tbody tr {
  animation: fadeInUp 0.3s ease-out;
  animation-fill-mode: both;

  @for $i from 1 through 20 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.05}s;
    }
  }
}
</style>
