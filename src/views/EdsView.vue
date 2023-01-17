<template>
  <Dialog :header="`ЭЦП ID: ${localEds.id}`" v-model:visible="displayModal"
    :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true">

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="id">ID: </label>
        <InputText id="id" type="username" v-model="localEds.id" disabled />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="organization">Организация: </label>
        <InputText id="organization" type="username" v-model="localEds.organization"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="position">Должность: </label>
        <InputText id="position" type="username" v-model="localEds.position"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="fullname">ФИО: </label>
        <InputText id="fullname" type="username" v-model="localEds.fullname"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="inn">ИНН организации: </label>
        <InputText id="inn" type="username" v-model="localEds.inn"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="certificateSerial">Серийный номер: </label>
        <InputText id="certificateSerial" type="username" v-model="localEds.certificateSerial"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="vendor">Поставщик: </label>
        <InputText id="vendor" type="username" v-model="localEds.vendor"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="usageType">Тип: </label>
        <InputText id="usageType" type="username" v-model="localEds.usageType"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="fromDate">Действует с: </label>
        <Calendar inputId="fromDate" v-model="localEds.fromDate" dateFormat="dd-mm-yy" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="toDate">Действует по: </label>
        <Calendar inputId="toDate" v-model="localEds.toDate" dateFormat="dd-mm-yy" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="comment">Комментарий: </label>
        <InputText id="comment" type="username" v-model="localEds.comment"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="accountId">ID аккаунта: </label>
        <InputText id="accountId" type="username" v-model="localEds.accountId"/>
      </div>
    </div>

    <div class="flex justify-content-center mt-2" v-if="error">
      <small id="error" style="color:red"> {{ `Ошибка выполнения запроса - ${ this.errorMessage }` }}</small>
    </div>

    <template #footer>
      <Button label="Удалить ЭЦП" icon="pi pi-times" @click="deleteEdsAndCloseModal"
        class="p-button-danger p-button-text" />
      <Button label="Сохранить" icon="pi pi-check" @click="saveWithoutCloseModal" 
        class="p-button-help p-button-text"/>
      <Button label="Сохранить и закрыть" icon="pi pi-check" @click="saveAndCloseModal" 
        class="p-button-text"/>
    </template>
  </Dialog>
</template>

<script>
import EdsService from '@/services/EdsService.js';

export default {
  props: {
    eds: Object,
    showComponent: Boolean,
  },

  created() {
    this.edsService = new EdsService();
  },

  data() {
    return {
      displayModal: this.showComponent,
      errorMessage: '',
      error: false,
      localEds: this.eds,
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
    eds: {
      handler(newValue, oldValue) {
        if (newValue === undefined) {
          console.log(oldValue);
          this.localEds = oldValue;
          return;
        }
        this.localEds = newValue;
      }
    }
  },

  methods: {
    async saveAndCloseModal() {
      try {
        await this.edsService.updateEds(this.localEds);
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
        await this.edsService.updateEds(this.localEds);
      } catch (error) {
        this.error = true;
        this.errorMessage = error.message;
        setTimeout(() => {
          this.error = false;
          this.errorMessage = '';
        }, 5000);
      }
    },
    async deleteEdsAndCloseModal() {
      try {
        await this.edsService.deleteEds(this.localEds.id);
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

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-dialog .p-button {
  min-width: 6rem;
}
</style>