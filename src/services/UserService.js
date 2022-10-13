import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default class UserService {
  getUsers() {
      return instance.get('/users').then(response => response.data);
  }

  updateUser(userEntity) {
    return instance.put(`/users/update/${userEntity.id}`, {
      name: userEntity.name,
      password: userEntity.password,
    }).then(response => response.data)
  }

  deleteUser(userID) {
    return instance.delete(`/users/delete/${userID}`);
  }
}