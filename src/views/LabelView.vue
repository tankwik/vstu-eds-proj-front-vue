<template>
  <Dialog :header="`ID записи: ${localLabel.id}`" v-model:visible="displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }" :style="{ width: '80vw' }" :modal="true">

    <div class="flex justify-content-center mt-1">
      <Button label="Предыдущий элемент" @click="previous(localLabel.id)" class="p-button-link" />
      <Button label="Следующий элемент" @click="next(localLabel.id)" class="p-button-link" />
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="id">ID: </label>
        <InputText id="id" type="username" v-model="localLabel.id" disabled />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="user_name">Имя пользователя: </label>
        <InputText id="user_name" type="username" v-model="localLabel.user_name" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="comp_name">Имя компьютера: </label>
        <InputText id="comp_name" type="username" v-model="localLabel.comp_name" />
      </div>
    </div>

    <div class="field">
      <DataTable v-model:selection="selectedLabels" :value="edses" dataKey="id" tableStyle="min-width: 100rem">
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="id" header="ID"></Column>
        <Column field="organization" header="Организация"></Column>
      </DataTable>
    </div>

    <div class="flex justify-content-center mt-2" v-if="error">
      <small id="error" style="color:red"> {{ `Ошибка выполнения запроса - ${this.errorMessage}` }}</small>
    </div>

    <template #footer>
      <Button label="Удалить запись" icon="pi pi-times" @click="deleteLabelsAndCloseModal"
        class="p-button-danger p-button-text" />
      <Button label="Сохранить" icon="pi pi-check" @click="saveWithoutCloseModal" class="p-button-help p-button-text" />
      <Button label="Сохранить и закрыть" icon="pi pi-check" @click="saveAndCloseModal" class="p-button-text" />
    </template>
  </Dialog>
</template>

<script>
import LabelsService from '@/services/LabelsService.js';
import EdsService from '@/services/EdsService.js';
import * as R from 'ramda';

export default {
  props: {
    edit_label: Object,
    showComponent: Boolean,
  },

  created() {
    this.edsService = new EdsService();
    this.LabelsService = new LabelsService();
  },

  mounted() {
    this.loadEdsesList();
  },

  data() {
    return {
      displayModal: this.showComponent,
      errorMessage: '',
      error: false,
      localLabel: this.edit_label,
      edses: [],
      selectedLabels: [],
    }
  },

  watch: {
    displayModal: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue === false) {
          this.$emit('close-modal');
        }
      },
    },
    edit_label: {
      handler(newValue, oldValue) {
        console.log(newValue, oldValue);
        if (newValue === undefined) {
          this.localLabel = oldValue;
          return;
        }
        this.localLabel = newValue;
      }
    }
  },

  methods: {
    async deleteLabelsAndCloseModal() {
      try {
        await this.LabelsService.deleteLabel(this.localLabel.id);
        this.displayModal = false;
      } catch (error) {
        this.error = true;
        this.errorMessage = error.message;
        setTimeout(() => {
          this.error = false;
          this.errorMessage = '';
        }, 5000);
      }
    },

    async saveWithoutCloseModal() {
      try {
        this.localLabel.ids_array = R.map(R.path(['id']))(this.selectedLabels);
        await this.LabelsService.updateLabel(this.localLabel);
      } catch (error) {
        this.error = true;
        this.errorMessage = error.message;
        setTimeout(() => {
          this.error = false;
          this.errorMessage = '';
        }, 5000);
      }
    },


    async saveAndCloseModal() {
      try {
        this.localLabel.ids_array = R.map(R.path(['id']))(this.selectedLabels);
        await this.LabelsService.updateLabel(this.localLabel);
        this.displayModal = false;
      } catch (error) {
        this.error = true;
        this.errorMessage = error.message;
        setTimeout(() => {
          this.error = false;
          this.errorMessage = '';
        }, 5000);
      }
    },

    loadEdsesList() {
      this.edsService.getEdses().then(data => {
        this.edses = data;
        this.selectedLabels = this.edses.filter(item => this.edit_label.ids_array.includes(item.id));
      });
    },

    previous(labelId) {
      this.$emit('get-prev-label', labelId);
      this.loadEdsesList();
    },
    next(labelId) {
      this.$emit('get-next-label', labelId);
      this.loadEdsesList();
    },
  },
};
</script>

<style scoped lang="scss">
.p-button {
  margin: 0.3rem .5rem;
  min-width: 10rem;
}

p {
  margin: 0;
}

.p-inputtext {
  width: 50%;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-dialog .p-button {
  min-width: 6rem;
}
</style>