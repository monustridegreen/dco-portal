const GRAPHQL_API_ENDPOINT = 'https://odyssey.stridegreen.in/spacedock/graphql';
const GRAPHQL_API_ENDPOINTAMP = 'https://odyssey.stridegreen.in/observatory/graphql';

function redirectToLogin() {
  localStorage.clear();
  window.location.href = '/engage/login';
}
export const fetchGraphQL = (query, variables) =>
  new Promise((resolve, reject) => {
    const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    fetch(GRAPHQL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-App-Id': 293,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          redirectToLogin();
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        reject(error);
      });
  });

export const fetchGraphQLAMP = (query, variables) =>
  new Promise((resolve, reject) => {
    const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    fetch(GRAPHQL_API_ENDPOINTAMP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-App-Id': 293,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          redirectToLogin();
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        reject(error);
      });
  });
