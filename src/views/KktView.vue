<template>
  <Dialog :header="`ККТ ID: ${localKkt.id}`" v-model:visible="displayModal"
    :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true">

    <div class="flex justify-content-center mt-1">
      <Button label="Предыдущий элемент" @click="previous(localKkt.id)" class="p-button-link" />
      <Button label="Следующий элемент" @click="next(localKkt.id)" class="p-button-link" />
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="id">ID: </label>
        <InputText id="id" type="username" v-model="localKkt.id" disabled />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="organization">Организация: </label>
        <InputText id="organization" type="username" v-model="localKkt.organization"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="regNumber">Рег. номер: </label>
        <InputText id="regNumber" type="username" v-model="localKkt.regNumber"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="zavNumber">Заводской №: </label>
        <InputText id="zavNumber" type="username" v-model="localKkt.zavNumber"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="kktModel">Модель: </label>
        <InputText id="kktModel" type="username" v-model="localKkt.kktModel"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="regDate">Дата регистрации: </label>
        <Calendar inputId="regDate" v-model="localKkt.regDate" dateFormat="dd-mm-yy" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="toDate">Срок действия: </label>
        <Calendar inputId="toDate" v-model="localKkt.toDate" dateFormat="dd-mm-yy" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="ofd">ОФД: </label>
        <InputText id="ofd" type="username" v-model="localKkt.ofd"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="fnModel">Модель ФН: </label>
        <InputText id="fnModel" type="username" v-model="localKkt.fnModel"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="zavNumberFN">Заводской номер ФН: </label>
        <InputText id="zavNumberFN" type="username" v-model="localKkt.zavNumberFN"/>
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="comPortNumber">Номер COM-порта: </label>
        <InputText id="comPortNumber" type="username" v-model="localKkt.comPortNumber"/>
      </div>
    </div>

    <div class="flex justify-content-center mt-2" v-if="error">
      <small id="error" style="color:red"> {{ `Ошибка выполнения запроса - ${ this.errorMessage }` }}</small>
    </div>

    <template #footer>
      <Button label="Удалить ККТ" icon="pi pi-times" @click="deleteKktAndCloseModal"
        class="p-button-danger p-button-text" />
      <Button label="Сохранить" icon="pi pi-check" @click="saveWithoutCloseModal" 
        class="p-button-help p-button-text"/>
      <Button label="Сохранить и закрыть" icon="pi pi-check" @click="saveAndCloseModal" 
        class="p-button-text"/>
    </template>
  </Dialog>
</template>

<script>
import KktService from '@/services/KktService.js';

export default {
  props: {
    kkt: Object,
    showComponent: Boolean,
  },

  created() {
    this.kktService = new KktService();
  },

  data() {
    return {
      displayModal: this.showComponent,
      errorMessage: '',
      error: false,
      localKkt: this.kkt,
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
    kkt: {
      handler(newValue, oldValue) {
        if (newValue === undefined) {
          console.log(oldValue);
          this.localKkt = oldValue;
          return;
        }
        this.localKkt = newValue;
      }
    }
  },

  methods: {
    async saveAndCloseModal() {
      try {
        await this.kktService.updateKkt(this.localKkt);
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
        await this.kktService.updateKkt(this.localKkt);
      } catch (error) {
        this.error = true;
        this.errorMessage = error.message;
        setTimeout(() => {
          this.error = false;
          this.errorMessage = '';
        }, 5000);
      }
    },
    async deleteKktAndCloseModal() {
      try {
        await this.kktService.deleteKkt(this.localKkt.id);
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
    previous(kktId) {
      this.$emit('get-prev-kkt', kktId);
    },
    next(kktId) {
      this.$emit('get-next-kkt', kktId);
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

.p-inputtext {
  width: 40%;
}

.p-calendar {
  width: 40%;
}
</style>