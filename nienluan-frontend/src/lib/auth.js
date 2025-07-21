import api from "./axios";

export async function login(username, password) {
   const response = await api.post(`/api/login`, {
      username,
      password,
   });

   const accessToken = response.data.access_token;
   const user = response.data.user;
   const roles = response.data.roles;
   const permissions = response.data.permissions;

   // Lưu JWT token vào localStorage
   localStorage.setItem("access_token", accessToken);
   localStorage.setItem("user", JSON.stringify(user));
   localStorage.setItem("roles", JSON.stringify(roles));
   localStorage.setItem("permissions", JSON.stringify(permissions));

   return response;
}

export async function logout() {
   localStorage.removeItem("access_token");
   localStorage.removeItem("user");
   localStorage.removeItem("roles");
   localStorage.removeItem("permissions");
}

export function usePermission() {
   let permissions = [];

   try {
      const stored = localStorage.getItem("permissions");
      permissions = stored ? JSON.parse(stored) : [];
   } catch (e) {
      console.warn("Lỗi đọc permissions:", e);
   }

   const hasPermission = (code) => {
      const result = permissions.includes(code);
      return result;
   };

   return { hasPermission };
}


export async function getCurrentUser() {
   const response = await api.get(`/api/get-current-user`);

   const user = response.data.user;

   // Lưu JWT token vào localStorage
   localStorage.setItem("user", JSON.stringify(user));

   // return response;
}
