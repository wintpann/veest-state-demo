import { useImmer } from 'use-immer';
import { useAction } from 'veest';
import { service, inject, countRenderedTimes } from '@/veest';
import { UserService, User } from '@services/user/type';
import { injectUserApiService } from '@services/api/user/service';
import { injectNotificationService } from '@services/notification/service';
import { isSuccess, remoteDataWith } from '@services/api/client/utils';
import { RemoteData } from '@services/api/client/type';
import { injectRouterService } from '@services/router/service';
import { injectCrossWindowService } from '@services/cross-window-event/service';
import { CrossWindowEvent } from '@services/cross-window-event/type';
import { useExhaustiveEffect } from '@/hooks/use-exhaustive-deps';

export const createUserService = service(
    injectUserApiService(),
    injectNotificationService(),
    injectRouterService(),
    injectCrossWindowService(),
    (
        useUserApiService,
        useNotificationService,
        useRouterService,
        useCrossWindowEventService,
    ): UserService => {
        const { logInRequest, logOutRequest, getUserRequest } = useUserApiService();
        const { apiRequestError, success } = useNotificationService();
        const { goHome, goCards, homeMatch } = useRouterService();
        const { fire, on } = useCrossWindowEventService();
        countRenderedTimes('service');

        const [remoteUser, setRemoteUser] = useImmer<RemoteData<User, { loggedIn: boolean }>>(
            remoteDataWith({ loggedIn: false }, { loading: true }),
        );

        const loadUser = useAction(async () => {
            setRemoteUser((draft) => {
                draft.loading = true;
            });
            const response = await getUserRequest();
            if (isSuccess(response)) {
                setRemoteUser({ data: response.data, loading: false, loggedIn: true });
                if (homeMatch) {
                    goCards({}, true);
                }
            } else {
                goHome(true);
                setRemoteUser((draft) => {
                    draft.loading = false;
                });
            }
        });

        useExhaustiveEffect(
            () =>
                on(CrossWindowEvent.LOGIN, async () => {
                    await loadUser();
                    goCards({}, true);
                }),
            [],
        );

        useExhaustiveEffect(
            () =>
                on(CrossWindowEvent.LOGOUT, () => {
                    setRemoteUser(remoteDataWith({ loggedIn: false }, { loading: false }));
                    goHome();
                }),
            [],
        );

        useExhaustiveEffect(() => {
            loadUser();
        }, []);

        const logIn: UserService['logIn'] = useAction(async () => {
            setRemoteUser((draft) => {
                draft.loading = true;
            });

            const response = await logInRequest();

            if (isSuccess(response)) {
                setRemoteUser({ loading: false, data: response.data, loggedIn: true });
                success(`Welcome, ${response.data.name}!`);
                fire(CrossWindowEvent.LOGIN);
                goCards({}, true);
            } else {
                apiRequestError();
                setRemoteUser((draft) => {
                    draft.loading = false;
                });
            }
        });

        const logOut: UserService['logOut'] = useAction(async () => {
            setRemoteUser((draft) => {
                draft.loading = true;
            });

            const response = await logOutRequest();

            if (isSuccess(response)) {
                setRemoteUser({ loading: false, data: null, loggedIn: false });
            } else {
                apiRequestError();
                setRemoteUser((draft) => {
                    draft.loading = false;
                });
            }
            fire(CrossWindowEvent.LOGOUT);
            goHome();
        });

        return { remoteUser, logIn, logOut };
    },
);

export const injectUserService = () => inject<UserService>()('userService');
