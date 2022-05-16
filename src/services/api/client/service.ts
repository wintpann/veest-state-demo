import axios from 'axios';
import { service, inject, countRenderedTimes } from '@/veest';
import { injectConfigService } from '@services/config/service';
import { ApiService, FailedResponse } from '@services/api/client/type';

export const createApiService = service(injectConfigService(), (useConfigService): ApiService => {
    const { apiURL } = useConfigService();
    countRenderedTimes('service');

    const client = axios.create({ baseURL: apiURL });

    return { client };
});

export const injectApiService = () => inject<ApiService>()('apiService');

export const failedResponse = (): FailedResponse => null;
