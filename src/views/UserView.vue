<template>
  <Dialog :header="`Пользователь ${user.name}`" v-model:visible="displayModal"
    :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '30vw'}" :modal="true">

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="id">ID: </label>
        <InputText id="id" type="username" v-model="user.id" disabled />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="name">Имя пользователя: </label>
        <InputText id="name" type="username" v-model="user.name" :class="{ 'p-invalid': invalid_name }" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="password">Пароль: </label>
        <InputText id="password" type="username" v-model="user.password" :class="{ 'p-invalid': invalid_password }" />
      </div>
    </div>

    <div class="flex justify-content-center mt-2" v-if="error">
      <small id="error" style="color:red"> {{ `Ошибка выполнения запроса -  ${ this.errorMessage }` }}</small>
    </div>

    <template #footer>
      <Button label="Удалить пользователя" icon="pi pi-times" @click="deleteUserAndCloseModal" class="p-button-danger p-button-text" />
      <Button label="Сохранить и закрыть" icon="pi pi-check" @click="saveAndCloseModal" autofocus />
    </template>
  </Dialog>
</template>

<script>
import UserService from '../services/UserService.js';

export default {
  props: {
    user: Object,
    showComponent: Boolean,
  },

  created() {
    this.userService = new UserService();
  },

  data() {
    return {
      displayModal: this.showComponent,
      errorMessage: '',
      invalid_name: false,
      invalid_password: false,
      error: false,
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
  },

  methods: {
    async saveAndCloseModal() {
      if (!this.validateInput()) return;

      try {
        await this.userService.updateUser(this.user);
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
    async deleteUserAndCloseModal() {
      if (!this.validateInput()) return;
      
      try {
        await this.userService.deleteUser(this.user.id);
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

    validateInput() {
      if (this.user.name === '') {
        this.invalid_name = true;
        setTimeout(() => {
          this.invalid_name = false;
        }, 5000);
        return false;
      }

      if (this.user.password === '') {
        this.invalid_password = true;
        setTimeout(() => {
          this.invalid_password = false;
        }, 5000);
        return false;
      }

      return true;
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