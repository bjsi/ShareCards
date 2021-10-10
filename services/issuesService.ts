import axios from 'axios';

import Repository from '~/models/cl-repository';

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: { Accept: 'application/json' },
  withCredentials: true,
});

export default {
  async listAsync() {
    const resp = await httpClient.get<Array<Repository>>('/issues');

    if (resp.data) {
      resp.data = resp.data.map((r) => new Repository(
        r.orgAndRepo,
        r.displayName,
        r.issues),
      );
    }

    return resp;
  },
};
