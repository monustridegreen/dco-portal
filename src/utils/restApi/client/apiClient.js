import basePath from '../../../shared/basepath';
import { getAccessToken } from '../../../utils/auth';

const BASE_URL = basePath.REST_API_ENDPOINTAMP;

export const apiRequest = async (endpoint, method = 'GET', body = null, customHeaders = {}) => {
  const accessToken = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'X-App-Id': 293,
    ...customHeaders,
  };
  const options = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.error(`Error in API request (${method} ${endpoint}):`, error);
    throw error;
  }
};
