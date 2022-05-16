import { useImmer } from 'use-immer';
import { useAction } from 'veest';
import { service, inject, countRenderedTimes } from '@/veest';
import { injectNotificationService } from '@services/notification/service';
import { RemoteData } from '@services/api/client/type';
import { isSuccess, remoteData } from '@services/api/client/utils';
import { injectCardApiService } from '@services/api/card/service';
import { injectCrossWindowService } from '@services/cross-window-event/service';
import { CrossWindowEvent } from '@services/cross-window-event/type';
import { CardLookupService, CardsLookup } from '@services/card/type';
import { injectUserService } from '@services/user/service';
import { useExhaustiveEffect } from '@/hooks/use-exhaustive-deps';

export const createCardLookupService = service(
    injectCardApiService(),
    injectNotificationService(),
    injectCrossWindowService(),
    injectUserService(),
    (
        useCardApiService,
        useNotificationService,
        useCrossWindowEventService,
        useUserService,
    ): CardLookupService => {
        const { apiRequestError } = useNotificationService();
        const { getCardsLookupRequest } = useCardApiService();
        const { on } = useCrossWindowEventService();
        const { remoteUser } = useUserService();

        countRenderedTimes('service');

        const [remoteLookup, setRemoteLookup] = useImmer<RemoteData<CardsLookup>>(
            remoteData({ loading: true }),
        );

        useExhaustiveEffect(
            () =>
                on(CrossWindowEvent.LOGOUT, () => {
                    setRemoteLookup(remoteData({ loading: false }));
                }),
            [],
        );

        const loadLookup = useAction(async (userId: string) => {
            const response = await getCardsLookupRequest(userId);
            if (isSuccess(response)) {
                setRemoteLookup({ data: response.data, loading: false });
            } else {
                apiRequestError();
            }
        });

        useExhaustiveEffect(() => {
            if (remoteUser.data?.id) {
                loadLookup(remoteUser.data.id);
            }
        }, [remoteUser.data?.id]);

        return { remoteLookup };
    },
);

export const injectCardLookupService = () => inject<CardLookupService>()('cardLookupService');
