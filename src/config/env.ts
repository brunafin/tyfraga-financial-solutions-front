const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error('VITE_API_URL não está definida. Configure o arquivo .env.');
}

export const env = {
  apiUrl,
};
