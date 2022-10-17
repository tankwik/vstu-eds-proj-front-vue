<template>
  <div>
    <DataTable :value="users" :paginator="true" class="p-datatable-users mt-3" :rows="5" dataKey="id" :rowHover="true"
      v-model:filters="filters" filterDisplay="menu" :loading="loading"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5,10,15]" currentPageReportTemplate="Показаны с {first} по {last} из {totalRecords} записей"
      :globalFilterFields="['id','name','password']" responsiveLayout="scroll">
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <div>
            <h4 class="m-0">Пользователи</h4>
          </div>
          <div>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Поиск" />
            </span>
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
      <Column field="id" header="ID" dataType="numeric" sortable style="min-width: 14rem">
        <template #body="{data}">
          {{data.id}}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по ID" />
        </template>
      </Column>
      <Column field="name" header="Имя пользователя" sortable filterMatchMode="contains" style="min-width: 14rem">
        <template #body="{data}">
          <span class="image-text">{{data.name}}</span>
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по логину" />
        </template>
      </Column>
      <Column field="password" header="Пароль" sortable filterMatchMode="contains" style="min-width: 14rem">
        <template #body="{data}">
          <span class="image-text">{{data.password}}</span>
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Поиск по паролю" />
        </template>
      </Column>
      <Column headerStyle="width: 4rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
        <template #body="{data}">
          <Button type="button" icon="pi pi-cog" @click="editUser(data)"></Button>
        </template>
      </Column>
    </DataTable>
    <user-view :user="editedUser" :showComponent="showModal" v-if="showModal"
      @close-modal="showModal = false; editedUser=null"
      @get-prev-user="getPrevUser($event)"
      @get-next-user="getNextUser($event)"></user-view>
  </div>
</template>

<script>
import UserService from '@/services/UserService.js';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import UserView from './UserView.vue';

export default {
  beforeRouteLeave(to, from, next) {
    if (to.redirectedFrom && to.redirectedFrom.name === 'logout') {
      this.localStorage.isAuth = false;
    }
    next()
  },
  components: {
    UserView,
  },
  data() {
    return {
      users: null,
      filters: {
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'id': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'password': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      },
      loading: true,
      showModal: false,
      editedUser: null,
    }
  },
  watch: {
    showModal: {
      handler(newValue) {
        if (!newValue) {
          this.reloadUserList();
        }
      }
    },
  },
  created() {
    this.userService = new UserService();
  },
  mounted() {
    this.reloadUserList();
  },
  methods: {
    editUser(user) {
      this.editedUser = user;
      this.showModal = true;
    },
    reloadUserList() {
      this.userService.getUsers().then(data => {
        this.users = data;
        this.loading = false;
      });
    },
    getPrevUser(userId) {
      const elementIndex = this.users.findIndex((item => item.id === userId));
      const prevElement = this.users.find((item, index) => index === elementIndex - 1);
      this.editedUser = prevElement;
    },
    getNextUser(userId) {
      const elementIndex = this.users.findIndex((item => item.id === userId));
      const nextElement = this.users.find((item, index) => index === elementIndex + 1);
      this.editedUser = nextElement;
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