import api from "./axios";

export const handleHealthCheck = async () => {
  try {
    const res = await api.get("/health");
    const data = res.data;

    alert(`Status: ${data.status}`);
  } catch (err) {
    alert("Health check failed ❌");
    console.error(err);
  }
};