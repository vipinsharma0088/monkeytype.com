import endpoints from "./endpoints";
import { buildHttpClient } from "./adapters/axios-adapter";

const API_PATH = "";
// @ts-ignore
const BASE_URL = window.MONKEY_CONFIG.BACKEND_URL;
const API_URL = `${BASE_URL}${API_PATH}`;

const httpClient = buildHttpClient(API_URL, 10000);

// API Endpoints
const Ape = {
  users: new endpoints.Users(httpClient),
  configs: new endpoints.Configs(httpClient),
  results: new endpoints.Results(httpClient),
  psas: new endpoints.Psas(httpClient),
  quotes: new endpoints.Quotes(httpClient),
  leaderboards: new endpoints.Leaderboards(httpClient),
  presets: new endpoints.Presets(httpClient),
  publicStats: new endpoints.Public(httpClient),
  apeKeys: new endpoints.ApeKeys(httpClient),
};

export default Ape;
