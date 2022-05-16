import { service, inject, countRenderedTimes } from '@/veest';
import { ConfigService } from '@services/config/type';

export const createConfigService = service((): ConfigService => {
    countRenderedTimes('service');
    return {
        apiURL: 'http://localhost:4000',
    };
});

export const injectConfigService = () => inject<ConfigService>()('configService');
