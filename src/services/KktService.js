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

export default class KktService {
  getKktes() {
    return instance.get('/kkt').then(response => response.data);
  }

  createKkt(kktEntity) {
    if (typeof kktEntity.fromDate === 'object') {
      kktEntity.fromDate = getTS(kktEntity.fromDate);
    }
    if (typeof kktEntity.toDate === 'object') {
      kktEntity.toDate = getTS(kktEntity.toDate);
    }
    return instance.post('/kkt/add', kktEntity).then(response => response.data)
  }

  updateKkt(kktEntity) {
    if (typeof kktEntity.fromDate === 'object') {
      kktEntity.fromDate = getTS(edsEntity.fromDate);
    }
    if (typeof kktEntity.toDate === 'object') {
      kktEntity.toDate = getTS(kktEntity.toDate);
    }
    return instance.put(`/kkt/update/${kktEntity.id}`, R.omit(['id'], kktEntity)).then(response => response.data).catch(console.log)
  }

  deleteKkt(kktID) {
    return instance.delete(`/kkt/delete/${kktID}`);
  }

}