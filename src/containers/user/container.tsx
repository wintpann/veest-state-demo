import React from 'react';
import { container, countRenderedTimes } from '@/veest';
import { injectUserService } from '@services/user/service';
import { UserInfo } from '@ui/user-info/component';

export const UserContainer = container(injectUserService(), (useUserService) => () => {
    const { remoteUser, logIn, logOut } = useUserService();
    countRenderedTimes('container');
    return (
        <UserInfo
            loggedIn={remoteUser.loggedIn}
            name={remoteUser.data?.name}
            onLogin={logIn}
            onLogout={logOut}
            loading={remoteUser.loading}
        />
    );
});
