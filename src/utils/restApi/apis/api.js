/* eslint-disable no-unused-vars */
import { apiRequest } from '../client/apiClient';
import { formatDate } from '../../../shared/functions';
import { toast } from 'react-toastify';
const AUTH_BASE_URL = 'https://odyssey.stridegreen.in/observatory/';
const fetchDashboardData = async (fromDate, toDate) => {
  let queryParams = '';
  if (fromDate && toDate) {
    queryParams = `&startDate=${formatDate(fromDate)}&endDate=${formatDate(toDate)}`;
  } else {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    queryParams = `&startDate=${thirtyDaysAgo.toISOString().split('T')[0]}&endDate=${today.toISOString().split('T')[0]}`;
  }
  const endpoint = `onboarding/prospect/asset-owner/dashboard?${queryParams}`;
  return await apiRequest(endpoint);
};
const handleLogin = async (username, password) => {
  const endpoint = `${AUTH_BASE_URL}auth/generate-token`; // Use AUTH_BASE_URL
  const body = {
    userName: username,
    password: password,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': 293,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const authToken = data.data.token;
      await fetchAccountDetails(authToken);
      localStorage.setItem('access_token', authToken);
      window.location.href = '/engage/dashboard';
    } else {
      toast.error('Login failed. Please try again.', { autoClose: 1500 });
    }
  } catch (error) {
    console.error('Error in handleLogin:', error);
    throw error;
  }
};

const fetchAccountDetails = async (token) => {
  try {
    const endpoint = 'im/user';
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(AUTH_BASE_URL + endpoint, requestOptions);
    const data = await response.json();

    if (data.success) {
      const userData = data.data;

      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('firstName', userData.firstName);
      localStorage.setItem('roleType', userData.roleType);
      localStorage.setItem('roleSubType', userData.roleSubType);
      localStorage.setItem('role', userData.role);
      localStorage.setItem('assetTypes', JSON.stringify(userData.assetTypes));
      localStorage.setItem('roles', JSON.stringify(userData.roles));
      localStorage.setItem('privileges', JSON.stringify(userData.privileges));

      return Promise.resolve();
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return Promise.reject(error);
  }
};

const evaluateCapitalProvider = async (applicantId) => {
  try {
    const endpoint = `onboarding/prospect/asset-owner/capital-provider/evaluate/${applicantId}`;
    const response = await apiRequest(endpoint, {
      method: 'GET',
    });

    if (response.success) {
      return response.data; // Return the evaluated data
    } else {
      throw new Error(response.message || 'Failed to evaluate capital provider');
    }
  } catch (error) {
    console.error('Error in evaluateCapitalProvider:', error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

export default { handleLogin, fetchDashboardData, fetchAccountDetails, evaluateCapitalProvider };
