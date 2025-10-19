import { baseURL, endpoints, loginAuth } from './api.js';

export async function loginApi(request) {
  const usernameApi = loginAuth.username;
  const passwordApi = loginAuth.password;
  const response = await request.post(`${baseURL}${endpoints.auth}`, {
    data: {
      username: usernameApi,
      password: passwordApi,
    },
    headers: {
      'Content-Type': 'application/json'
      // Add more headers here if needed
    },
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Login failed: ${body.reason || response.statusText}`);
  }
  return body.token; // Return token for authorized requests
}

