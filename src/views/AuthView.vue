<template>
  <div class="flex justify-content-center root-panel">
    <Panel class="w-3 h-15rem">
      <template #header>
        <div class="flex w-full justify-content-center">
          Авторизация
        </div>
      </template>
      <form class="form" @submit.prevent="handleSubmit">
        <div class="field">
          <div class="flex justify-content-between">
            <label for="login">Логин: </label>
            <InputText id="login" type="username" v-model="login" class="login-input" />
          </div>
        </div>
        <div class="field">
          <div class="flex justify-content-between mt-2">
            <label for="password" class="-ml-2">Пароль: </label>
            <Password id="password" v-model="password" toggleMask></Password>
          </div>
        </div>
        <div class="flex justify-content-center mt-4">
          <Button label="Войти" type="submit" />
        </div>
      </form>
    </Panel>
  </div>
</template>

<script>
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});


export default {
  data() {
    return {
      login: '',
      password: '',
    }
  },

  
  methods: {
    handleSubmit() {
      instance.post('/users/auth',
        {
          login: this.login,
          password: this.password
        }
      ).then((response) => {
        this.localStorage.isAuth = !!response.data.isAuth;
        this.$router.push('/users');
      }
      ).catch((error) => {
        console.log(error);
      }
      )
    },
  },
};
</script>

<style scoped>
.p-panel {
  border-radius: 5px;
  border-color: var(--teal-700);
}

.p-panel-content {
  background-color: #ffffff;
}

.login-input {
  width: 235px;
}

.root-panel {
  margin-top: 10%;
}
</style>