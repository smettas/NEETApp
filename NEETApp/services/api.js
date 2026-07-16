import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: point this at your backend.
// - Android emulator:            http://10.0.2.2:8000/api/auth
// - iOS simulator / Expo web:    http://localhost:8000/api/auth
// - Physical device (Expo Go):   http://<your-computer's-LAN-IP>:8000/api/auth
//   (find your LAN IP with `ipconfig` on Windows / `ifconfig` on Mac-Linux —
//    your phone and computer must be on the same Wi-Fi network)
// Web testing: use localhost
// Physical device: use http://192.168.1.46:8000/api/auth
const BASE_URL = "http://localhost:8000/api/auth";

const request = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem("token");
  const url = `${BASE_URL}${endpoint}`;
  
  console.log(`[API] ${options.method || 'GET'} ${url}`);

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
        ...(options.headers || {}),
      },
      timeout: 15000, // 15 second timeout
    });
  } catch (networkError) {
    console.error('[API] Network Error:', networkError.message);
    throw new Error(`Could not reach the server (${networkError.message}). Check your backend is running and BASE_URL is correct.`);
  }

  let data = {};
  try {
    data = await response.json();
  } catch (parseError) {
    console.warn('[API] Response parsing warning:', parseError.message);
    // no JSON body
  }

  console.log(`[API] Response Status: ${response.status}`, data);

  if (!response.ok) {
    const errorMsg = data.error || data.message || "Something went wrong. Please try again.";
    console.error('[API] Error Response:', errorMsg);
    throw new Error(errorMsg);
  }

  return data;
};

const api = {
  login: (mobile, password) =>
    request("/login/", {
      method: "POST",
      body: JSON.stringify({ mobile, password }),
    }),

  register: (payload) =>
    request("/register/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  changePassword: (mobile, currentPassword, newPassword) =>
    request("/change-password/", {
      method: "POST",
      body: JSON.stringify({ mobile, current_password: currentPassword, new_password: newPassword }),
    }),

  getProfile: () => request("/profile/", { method: "GET" }),

  getHomeLeaveRequests: () => request("/home-leave-requests/", { method: "GET" }),

  submitHomeLeaveRequest: (payload) =>
    request("/home-leave-requests/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getParentVisitRequests: () => request("/parent-visit-requests/", { method: "GET" }),

  submitParentVisitRequest: (payload) =>
    request("/parent-visit-requests/", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/logout/", { method: "POST" }),
};

export default api;
