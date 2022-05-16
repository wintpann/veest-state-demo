import { useImmer } from 'use-immer';
import { useAction } from 'veest';
import { service, inject, countRenderedTimes } from '@/veest';
import { injectNotificationService } from '@services/notification/service';
import { injectTransactionApiService } from '@services/api/transaction/service';
import { RemoteData } from '@services/api/client/type';
import { isSuccess, remoteData } from '@services/api/client/utils';
import { injectCrossWindowService } from '@services/cross-window-event/service';
import { CrossWindowEvent } from '@services/cross-window-event/type';
import { TransactionLookupService, TransactionsLookup } from '@services/transaction/type';
import { useExhaustiveEffect } from '@/hooks/use-exhaustive-deps';
import { injectUserService } from '@services/user/service';

export const createTransactionLookupService = service(
    injectTransactionApiService(),
    injectNotificationService(),
    injectCrossWindowService(),
    injectUserService(),
    (
        useTransactionApiService,
        useNotificationService,
        useCrossWindowEventService,
        useUserService,
    ): TransactionLookupService => {
        const { apiRequestError } = useNotificationService();
        const { getTransactionsLookupRequest } = useTransactionApiService();
        const { on } = useCrossWindowEventService();
        const { remoteUser } = useUserService();
        countRenderedTimes('service');

        const [remoteLookup, setRemoteLookup] = useImmer<RemoteData<TransactionsLookup>>(
            remoteData(),
        );

        const loadLookup = useAction(async (userId: string) => {
            const response = await getTransactionsLookupRequest(userId);
            if (isSuccess(response)) {
                setRemoteLookup({ data: response.data, loading: false });
            } else {
                apiRequestError();
            }
        });

        useExhaustiveEffect(
            () =>
                on(CrossWindowEvent.LOGOUT, () => {
                    setRemoteLookup(remoteData({ loading: false }));
                }),
            [],
        );

        useExhaustiveEffect(() => {
            if (remoteUser.data?.id) {
                loadLookup(remoteUser.data.id);
            }
        }, [remoteUser.data?.id]);

        return {
            remoteLookup,
        };
    },
);

export const injectTransactionLookupService = () =>
    inject<TransactionLookupService>()('transactionLookupService');
