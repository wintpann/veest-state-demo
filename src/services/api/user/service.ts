import { service, inject, countRenderedTimes } from '@/veest';
import { failedResponse, injectApiService } from '@services/api/client/service';
import { UserApiService, UserApiPaths } from '@services/api/user/type';

export const createUserApiService = service(injectApiService(), (useApiService): UserApiService => {
    const { client } = useApiService();
    countRenderedTimes('service');

    const logInRequest: UserApiService['logInRequest'] = async () => {
        try {
            return await client.post(UserApiPaths.LOGIN);
        } catch (e) {
            return failedResponse();
        }
    };

    const logOutRequest: UserApiService['logOutRequest'] = async () => {
        try {
            return await client.post(UserApiPaths.LOGOUT);
        } catch (e) {
            return failedResponse();
        }
    };

    const getUserRequest: UserApiService['getUserRequest'] = async () => {
        try {
            const user = await client.get(UserApiPaths.GET_USER);
            return user ?? failedResponse();
        } catch (e) {
            return failedResponse();
        }
    };

    return { logInRequest, logOutRequest, getUserRequest };
});

export const injectUserApiService = () => inject<UserApiService>()('userApiService');
