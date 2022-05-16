import { Response } from '@services/api/client/type';
import { User } from '@services/user/type';

export type UserApiService = {
    logInRequest: () => Promise<Response<User>>;
    logOutRequest: () => Promise<Response>;
    getUserRequest: () => Promise<Response<User>>;
};

export enum UserApiPaths {
    LOGIN = 'user/login',
    LOGOUT = 'user/logout',
    GET_USER = 'user',
}
