<template>
  <DataTable :value="kktes" :paginator="true" class="p-datatable-small mt-3" :rows="5" dataKey="id" :rowHover="true"
    v-model:filters="filters" filterDisplay="menu" :loading="loading" style="font-size: 12px;"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5, 10, 15]" currentPageReportTemplate="Показаны с {first} по {last} из {totalRecords} записей"
    :globalFilterFields="['id', 'organigation', 'certificateSerial']" responsiveLayout="scroll">
    <template #header>
      <div class="flex justify-content-between align-items-center">
        <div>
          <h4 class="m-0">Сертификаты ККТ</h4>
        </div>
        <div>
          <Button label="Добавить" icon="pi pi-plus" class="p-button-rounded" @click="showCreateModal=true"/>
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
    <Column field="organization" header="Организация" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.organization }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по организации" />
      </template>
    </Column>
    <Column field="regNumber" header="Рег. номер" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.regNumber }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по рег. номеру" />
      </template>
    </Column>
    <Column field="zavNumber" header="Заводской №" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.zavNumber }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по заводскому номеру" />
      </template>
    </Column>
    <Column field="kktModel" header="Модель" sortable>
      <template #body="{ data }">
        <span class="image-text">{{ data.kktModel }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по модели" />
      </template>
    </Column>
    <Column field="regDate" header="Дата регистрации" sortable dataType="date">
      <template #body="{ data }">
        {{ formatDate(data.regDate) }}
      </template>
    </Column>
    <Column field="toDate" header="Срок действия" sortable dataType="date">
      <template #body="{ data }">
        {{ formatDate(data.toDate) }}
      </template>
    </Column>
    <Column field="ofd" header="ОФД" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.ofd }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по ОФД" />
      </template>
    </Column>
    <Column field="fnModel" header="Модель ФН" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.fnModel }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по модели ФН" />
      </template>
    </Column>
    <Column field="zavNumberFN" header="Заводской номер ФН" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.zavNumberFN }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по зав-му № ФН" />
      </template>
    </Column>
    <Column field="comPortNumber" header="Номер COM-порта" sortable filterMatchMode="contains">
      <template #body="{ data }">
        <span class="image-text">{{ data.comPortNumber }}</span>
      </template>
      <template #filter="{ filterModel }">
        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по номеру COM-порта" />
      </template>
    </Column>
    <Column headerStyle="width: 4rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
      <template #body="{ data }">
        <Button type="button" icon="pi pi-cog" @click="editKkt(data)"></Button>
      </template>
    </Column>
  </DataTable>
  <kkt-view :kkt="editedKkt" :showComponent="showModal" v-if="showModal"
    @close-modal="showModal = false; editedKkt = null"
    @get-prev-kkt="getPrevKkt($event)"
    @get-next-kkt="getNextKkt($event)"></kkt-view>
  <create-kkt-view :eds="{}" :showComponent="showCreateModal" v-if="showCreateModal"
    @close-modal="showCreateModal = false"></create-kkt-view>
</template>

<script>
import KktService from '@/services/KktService.js';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import KktView from './KktView.vue';
import CreateKktView from './CreateKktView.vue';

const API_URL = import.meta.env.VITE_API_URL;

export default {
  beforeRouteLeave(to, from, next) {
    if (to.redirectedFrom && to.redirectedFrom.name === 'logout') {
      this.localStorage.isAuth = false;
    }
    next()
  },

  created() {
    this.KktService = new KktService();
  },

  mounted() {
    this.reloadKktList();
  },

  components: {
    KktView,
    CreateKktView,
  },

  data() {
    return {
      kktes: null,
      filters: {
        'id': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'organization': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'regNumber': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'zavNumber': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'kktModel': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'ofd': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'fnModel': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'zavNumberFN': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'comPortNumber': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      },
      loading: true,
      showModal: false,
      showCreateModal: false,
      editedKkt: null,
    }
  },

  watch: {
    showModal: {
      handler(newValue) {
        if (!newValue) {
          this.reloadKktList();
        }
      }
    },

    showCreateModal: {
      handler(newValue) {
        if (!newValue) {
          this.reloadKktList();
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

    reloadKktList() {
      this.KktService.getKktes().then(data => {
        this.kktes = data;
        this.loading = false;
      });
    },

    editKkt(kkt) {
      this.editedKkt = kkt;
      this.showModal = true;
    },

    getPrevKkt(userId) {
      const elementIndex = this.kktes.findIndex((item => item.id === userId));
      const prevElement = this.kktes.find((item, index) => index === elementIndex - 1);
      this.editedKkt = prevElement;
    },

    getNextKkt(userId) {
      const elementIndex = this.kktes.findIndex((item => item.id === userId));
      const nextElement = this.kktes.find((item, index) => index === elementIndex + 1);
      this.editedKkt = nextElement;
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
}
</style>