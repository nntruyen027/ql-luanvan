import axios from "axios";

const api = axios.create({
   baseURL: "http://localhost:8000",
   withCredentials: true,
});

// Thêm interceptor gắn Authorization header
if (typeof window !== "undefined") {
   api.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   });

   // Tuỳ chọn: Tự động logout nếu token hết hạn
   api.interceptors.response.use(
      (response) => response,
      (error) => {
         const accessToken = localStorage.getItem("access_token");
         const currentPath = window.location.pathname;

         const isLoginPage = [
            "/auth/teacher/login",
            "/auth/administrator/login",
            "/auth/student/login",
         ].includes(currentPath);

         // Nếu không có token → chưa đăng nhập
         if (!accessToken) {
            window.location.href = "/auth/unauthenticated";
            return;
         }

         // Nếu token hết hạn
         if (error.response?.status === 401 && !isLoginPage) {
            localStorage.removeItem("access_token");
            window.location.href = "/auth/unauthenticated";
            return;
         }

         return Promise.reject(error); // Cho các lỗi khác đi tiếp
      }
   );
}

export default api;
