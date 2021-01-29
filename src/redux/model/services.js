import axios from 'axios';
import { baseUrl } from '../../constants/defaultValues';
import { getToken } from '../../helpers/Utils';

export const sumbitModelService = async (data) => {
  const token = getToken();
  try {
    const response = await axios.post(`${baseUrl}/model/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch ({ response }) {
    return response;
  }
};

export const deleteModelService = async (ids) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${baseUrl}/model/delete`,
      { ids },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch ({ response }) {
    return response;
  }
};

export const publishModelService = async (id, type) => {
  const token = getToken();
  try {
    const response = await axios.patch(
      `${baseUrl}/model/publish/${id}/${type}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch ({ response }) {
    return response;
  }
};

export const getCurriculumService = async () => {
  try {
    const response = await axios.get(`${baseUrl}/curriculum`);
    return response;
  } catch ({ response }) {
    return response;
  }
};

export const updateCurriculumService = async (title, fileUrl) => {
  const token = getToken();
  try {
    const response = await axios.put(
      `${baseUrl}/curriculum/update/6013a851feae97436c13e110`,
      { title, fileUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch ({ response }) {
    return response;
  }
};
