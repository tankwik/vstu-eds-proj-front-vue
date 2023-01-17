import axios from 'axios';
import * as R from 'ramda';

const API_URL = import.meta.env.VITE_API_URL;
const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

function getTS(date) {
  const pad = (num) => num < 10 ? '0' + num : num;
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

export default class UserService {
  getEdses() {
    return instance.get('/eds').then(response => response.data);
  }

  createEds(edsEntity) {
    if (typeof edsEntity.fromDate === 'object') {
      edsEntity.fromDate = getTS(edsEntity.fromDate);
    }
    if (typeof edsEntity.toDate === 'object') {
      edsEntity.toDate = getTS(edsEntity.toDate);
    }
    return instance.post('/eds/add', edsEntity).then(response => response.data)
  }

  updateEds(edsEntity) {
    if (typeof edsEntity.fromDate === 'object') {
      edsEntity.fromDate = getTS(edsEntity.fromDate);
    }
    if (typeof edsEntity.toDate === 'object') {
      edsEntity.toDate = getTS(edsEntity.toDate);
    }
    return instance.put(`/eds/update/${edsEntity.id}`, R.omit(['id'], edsEntity)).then(response => response.data).catch(console.log)
  }

  deleteEds(edsID) {
    return instance.delete(`/eds/delete/${edsID}`);
  }

  uploadFile(file, id) {
    const formData = new FormData();
    formData.append("file", file);
    return instance.post(`/eds/addfile/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => response.data).catch(console.log);
  }

  deleteFile(id) {
    return instance.delete(`/eds/deletefile/${id}`);
  }

}