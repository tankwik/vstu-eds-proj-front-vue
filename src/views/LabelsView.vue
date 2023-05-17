<template>
  <DataTable :value="labels" :paginator="true" class="p-datatable-small mt-3" :rows="5" dataKey="id" :rowHover="true"
    v-model:filters="filters" filterDisplay="menu" :loading="loading" style="font-size: 12px;"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5, 10, 15]" currentPageReportTemplate="Показаны с {first} по {last} из {totalRecords} записей"
    :globalFilterFields="['id', 'user_name', 'comp_name']" responsiveLayout="scroll">
    <template #header>
      <div class="flex justify-content-between align-items-center">
        <div>
          <h4 class="m-0">Связка пользователей с ЭЦП</h4>          
          <h4 class="m-0">Есть несохраненные изменения: <b :style="{ color: fileStatus ? 'red' : 'green' }">{{ fileStatus ? 'ДА' : 'НЕТ' }}</b></h4>
        </div>
        <div class="flex flex-column">
          <Button label="Добавить" icon="pi pi-plus" class="p-button-rounded" @click="showCreateModal=true"/>
          <Button v-if="fileStatus" label="Экспортировать в ФС" icon="pi pi-save" class="p-button-danger mt-3 p-button-rounded" @click="saveChanges"/>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex justify-content-center">
        <span>
          <h5>По вашему запросу ничего не найдено...</h5>
        </span>
      </div>
    </template>
    <template #loading>
      Загрузка данных. Пожалуйста, дождитесь окончания загрузки...
    </template>
    <Column field="id" header="ID" dataType="numeric" sortable>
      <template #body="{ data }">
        {{ data.id }}
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по ID" />
      </template>
    </Column>
    <Column field="user_name" header="Имя пользователя" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.user_name }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по имени пользователя" />
      </template>
    </Column>
    <Column field="comp_name" header="Имя компьютера" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.comp_name }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по имени компьютера" />
      </template>
    </Column>
    <Column headerStyle="width: 4rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
      <template #body="{ data }">
        <Button type="button" icon="pi pi-cog" @click="editLabel(data)"></Button>
      </template>
    </Column>
  </DataTable>
  <label-view :edit_label="editedLabel" :showComponent="showModal" v-if="showModal"
    @close-modal="showModal = false; editedLabel = null"
    @get-prev-label="getPrevLabel($event)"
    @get-next-label="getNextLabel($event)"></label-view>
  <create-label-view :edit_label="{}" :showComponent="showCreateModal" v-if="showCreateModal"
    @close-modal="showCreateModal = false"></create-label-view>
</template>

<script>
import LabelsService from '@/services/LabelsService.js';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import LabelView from './LabelView.vue';
import CreateLabelView from './CreateLabelView.vue';

export default {
  beforeRouteLeave(to, _, next) {
    if (to.redirectedFrom && to.redirectedFrom.name === 'logout') {
      this.localStorage.isAuth = false;
    }
    next()
  },

  created() {
    this.labelsService = new LabelsService();
  },

  mounted() {
    this.reloadLabelsList();
  },

  components: {
    LabelView,
    CreateLabelView,
  },

  data() {
    return {
      labels: null,
      filters: {
        'id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'user_name': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        'comp_name': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      },
      loading: true,
      showModal: false,
      showCreateModal: false,
      editedLabel: null,
      fileStatus: false,
    }
  },

  watch: {
    showModal: {
      handler(newValue) {
        if (!newValue) {
          this.reloadLabelsList();
        }
      }
    },

    showCreateModal: {
      handler(newValue) {
        if (!newValue) {
          this.reloadLabelsList();
        }
      }
    },
  },

  methods: {
    formatDate(value) {
      const time = new Date(value);
      return time.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },

    reloadLabelsList() {
      this.labelsService.getLabels().then(async (data) => {
        this.labels = data;
        this.loading = false;
        this.fileStatus = await this.labelsService.getStatus();
      });
    },

    editLabel(editedLabel) {
      this.editedLabel = editedLabel;
      this.showModal = true;
    },

    getPrevLabel(id) {
      const elementIndex = this.labels.findIndex((item => item.id === id));
      const prevElement = this.labels.find((_, index) => index === elementIndex - 1);
      this.editedLabel = prevElement;
    },

    getNextLabel(id) {
      const elementIndex = this.labels.findIndex((item => item.id === id));
      const nextElement = this.labels.find((_, index) => index === elementIndex + 1);
      this.editedLabel = nextElement;
    },

    async saveChanges() {
      await this.labelsService.saveChanges();
      this.fileStatus = false;
    },
  },

};
</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
  .p-paginator-current {
    margin-left: auto;
  }
}

::v-deep(.p-progressbar) {
  height: .5rem;
  background-color: #D8DADC;

  .p-progressbar-value {
    background-color: #607D8B;
  }
}

::v-deep(.p-datepicker) {
  min-width: 25rem;

  td {
    font-weight: 400;
  }
}

::v-deep(.p-datatable.p-datatable-customers) {
  .p-datatable-header {
    padding: 1rem;
    text-align: left;
    font-size: 1.5rem;
  }

  .p-paginator {
    padding: 1rem;
  }

  .p-datatable-thead>tr>th {
    text-align: left;
  }

  .p-datatable-tbody>tr>td {
    cursor: auto;
  }

  .p-dropdown-label:not(.p-placeholder) {
    text-transform: uppercase;
  }

  .on_class {
    color: green;
  }

  .off_class {
    color: red;
  }
}
</style>