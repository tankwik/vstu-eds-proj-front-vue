<template>
  <Dialog header="Информация о новой записи ККТ" v-model:visible="displayModal"
    :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true">

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
        await this.kktService.createKkt(this.localKkt);
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