import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default class LabelsService {
  async getLabels() {
    const response = await instance.get('/labels');
    return response.data;
  };

  async createLabel(labelEntity) {
    const response = await instance.post('/labels/add', labelEntity);
    return response.data;
  }

  async updateLabel(labelEntity) {
    const response = await instance.post('/labels/update', labelEntity);
    return response.data;
  }

  deleteLabel(labelID) {
    return instance.delete(`/labels/delete/${labelID}`);
  }

  async getStatus() {
    const response = await instance.get('/labels/status');
    return response.data;
  }
}