
// Use environment-aware API URL
export const API_URL = import.meta.env.PROD 
  ? "https://google-server-843669231634.europe-west4.run.app"  // Production URL
  : "http://localhost:3001"; // Local development
