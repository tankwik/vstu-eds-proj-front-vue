<template>
  <Dialog :header="`Пользователь ${localUser.name}`" v-model:visible="displayModal"
    :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '40vw'}" :modal="true">

    <div class="flex justify-content-center mt-1">
      <Button label="Предыдущий элемент" @click="previous(localUser.id)" class="p-button-link" />
      <Button label="Следующий элемент" @click="next(localUser.id)" class="p-button-link" />
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="id">ID: </label>
        <InputText id="id" type="username" v-model="localUser.id" disabled />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="name">Имя пользователя: </label>
        <InputText id="name" type="username" v-model="localUser.name" :class="{ 'p-invalid': invalid_name }" />
      </div>
    </div>

    <div class="field">
      <div class="flex justify-content-between mt-1">
        <label for="password">Пароль: </label>
        <InputText id="password" type="username" v-model="localUser.password"
          :class="{ 'p-invalid': invalid_password }" />
      </div>
    </div>

    <div class="flex justify-content-center mt-2" v-if="error">
      <small id="error" style="color:red"> {{ `Ошибка выполнения запроса - ${ this.errorMessage }` }}</small>
    </div>

    <template #footer>
      <Button label="Удалить пользователя" icon="pi pi-times" @click="deleteUserAndCloseModal"
        class="p-button-danger p-button-text" />
      <Button label="Сохранить" icon="pi pi-check" @click="saveWithoutCloseModal" 
        class="p-button-help p-button-text"/>
      <Button label="Сохранить и закрыть" icon="pi pi-check" @click="saveAndCloseModal" 
        class="p-button-text"/>
    </template>
  </Dialog>
</template>

<script>
import UserService from '@/services/UserService.js';

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
      localUser: this.user,
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
    user: {
      handler(newValue, oldValue) {
        if (newValue === undefined) {
          console.log(oldValue);
          this.localUser = oldValue;
          return;
        }
        this.localUser = newValue;
      }
    }
  },

  methods: {
    async saveAndCloseModal() {
      if (!this.validateInput()) return;

      try {
        await this.userService.updateUser(this.localUser);
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
      if (!this.validateInput()) return;

      try {
        await this.userService.updateUser(this.localUser);
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
        await this.userService.deleteUser(this.localUser.id);
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
      if (this.localUser.name === '') {
        this.invalid_name = true;
        setTimeout(() => {
          this.invalid_name = false;
        }, 5000);
        return false;
      }

      if (this.localUser.password === '') {
        this.invalid_password = true;
        setTimeout(() => {
          this.invalid_password = false;
        }, 5000);
        return false;
      }

      return true;
    },
    previous(userId) {
      this.$emit('get-prev-user', userId);
    },
    next(userId) {
      this.$emit('get-next-user', userId);
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