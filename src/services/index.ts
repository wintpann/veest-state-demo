import { createConfigService } from '@services/config/service';
import { createApiService } from '@services/api/client/service';
import { createNotificationService } from '@services/notification/service';
import { createUserApiService } from '@services/api/user/service';
import { createUserService } from '@services/user/service';
import { createTransactionApiService } from '@services/api/transaction/service';
import { createCardApiService } from '@services/api/card/service';
import { createRouterService } from '@services/router/service';
import { createCrossEventWindowService } from '@services/cross-window-event/service';
import { createCardLookupService } from '@services/card/lookup/service';
import { createCardListService } from '@services/card/list/service';
import { createCardDetailsService } from '@services/card/details/service';
import { createTransactionLookupService } from '@services/transaction/lookup/service';
import { createTransactionListService } from '@services/transaction/list/service';
import { createTransactionDetailsService } from '@services/transaction/details/service';

const configService = createConfigService();
const notificationService = createNotificationService();
const routerService = createRouterService();
const crossWindowEventService = createCrossEventWindowService();

const apiService = createApiService({ configService });
const userApiService = createUserApiService({ apiService });
const transactionApiService = createTransactionApiService({ apiService });
const cardApiService = createCardApiService({ apiService });

const userService = createUserService({
    userApiService,
    notificationService,
    routerService,
    crossWindowEventService,
});

const cardLookupService = createCardLookupService({
    cardApiService,
    notificationService,
    crossWindowEventService,
    userService,
});
const cardListService = createCardListService({
    cardApiService,
    notificationService,
    crossWindowEventService,
});
const cardDetailsService = createCardDetailsService({
    cardApiService,
    transactionApiService,
    notificationService,
    crossWindowEventService,
});

const transactionLookupService = createTransactionLookupService({
    transactionApiService,
    notificationService,
    crossWindowEventService,
    userService,
});
const transactionListService = createTransactionListService({
    transactionApiService,
    notificationService,
    crossWindowEventService,
});
const transactionDetailsService = createTransactionDetailsService({
    transactionApiService,
    notificationService,
    crossWindowEventService,
});

export const services = {
    configService,
    notificationService,
    apiService,
    userApiService,
    userService,
    transactionApiService,
    cardApiService,
    cardLookupService,
    routerService,
    crossWindowEventService,
    cardListService,
    cardDetailsService,
    transactionLookupService,
    transactionListService,
    transactionDetailsService,
} as const;
