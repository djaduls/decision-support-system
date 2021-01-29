import axios from 'axios';
import { baseUrl } from '../../constants/defaultValues';

export const userLoginService = async (userData) => {
  try {
    const response = await axios.post(`${baseUrl}/user/login`, userData);
    return response;
  } catch ({ response }) {
    return response;
  }
};

export const resetPasswordService = async (userData) => {
  try {
    const response = await axios.post(
      `${baseUrl}/user/reset-password`,
      userData
    );
    return response;
  } catch ({ response }) {
    return response;
  }
};
