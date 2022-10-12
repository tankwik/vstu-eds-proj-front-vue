
<template>
  <div>
    <Menubar :model="items" class="justify-content-between">
      <template #start>
        <h3>Управление сертификатами</h3>
      </template>
      <template #item="{item}">
        <router-link :to="item.to" custom v-slot="{navigate, isActive}" v-if="isAuth">
          <Button
            :style="isActive ? 'color: var(--orange-700); text-decoration: underline solid var(--orange-700) !important' : 'none'"
            :label="item.label" :icon="item.icon" @click="navigate" class="p-button-link" />
        </router-link>
      </template>
    </Menubar>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  components: {
    RouterLink,
  },

  data() {
    return {
      items: [
        {
          label: 'Пользователи',
          icon: 'pi pi-fw pi-users',
          to: '/users',
        },
        {
          label: 'Сертификаты ЭЦП',
          icon: 'pi pi-fw pi-file-o',
          to: '/edses',
        },
        {
          label: 'Сертификаты ККТ',
          icon: 'pi pi-fw pi-wallet',
          to: '/kktes',
        },
        {
          label: 'Выход',
          icon: 'pi pi-fw pi-power-off',
          to: '/logout',
        }
      ],
    }
  },

  methods: {
    logout(event) {
      console.log(event);
    }
  },

  computed: {
    isAuth() {
      return this.localStorage.isAuth;
    },
  },
}
</script>

<style scoped>
h3 {
  color: var(--teal-700)
}
</style>