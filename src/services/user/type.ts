import { RemoteData } from '@services/api/client/type';

export type User = {
    name: string;
    id: string;
};

export type UserService = {
    remoteUser: RemoteData<User, { loggedIn: boolean }>;
    logIn: () => Promise<void>;
    logOut: () => Promise<void>;
};
