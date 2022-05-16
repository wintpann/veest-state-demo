import useReactRouterBreadcrumbs from 'use-react-router-breadcrumbs';
import { useNavigate, useMatch, useSearchParams } from 'react-router-dom';
import last from 'lodash/last';
import { useAction } from 'veest';
import { service, inject, countRenderedTimes } from '@/veest';
import { RouterService } from '@services/router/type';
import { CardFilter } from '@services/card/type';
import { getCardsRoute } from '@services/card/list/utils';
import { ROUTES } from '@/routes';
import { TransactionFilter } from '@services/transaction/type';
import { getTransactionsRoute } from '@services/transaction/list/utils';

const pathToTitleMap: Record<string, string> = {
    [ROUTES.HOME]: 'Home',
    [ROUTES.TRANSACTIONS]: 'Transactions',
    [ROUTES.CARDS]: 'Cards',
};

const mapPathToTitle = (path: string) => pathToTitleMap[path] ?? last(path.split('/'));

export const createRouterService = service((): RouterService => {
    const crumbs = useReactRouterBreadcrumbs();

    const transactionDetailsMatch = useMatch(ROUTES.TRANSACTION);
    const cardDetailsMatch = useMatch(ROUTES.CARD);
    const homeMatch = useMatch(ROUTES.HOME);
    countRenderedTimes('service');

    const [searchParams] = useSearchParams();

    const breadcrumbs: RouterService['breadcrumbs'] = crumbs.map((item) => ({
        path: item.match.pathname,
        title: mapPathToTitle(item.match.pathname),
    }));

    const navigate = useNavigate();

    const goHome = useAction((replace = true) => {
        navigate(ROUTES.HOME, { replace });
    });

    const goCards = useAction((filter: CardFilter, replace: boolean) => {
        navigate(getCardsRoute(filter), { replace });
    });

    const goTransactions = useAction((filter: TransactionFilter, replace: boolean) => {
        navigate(getTransactionsRoute(filter), { replace });
    });

    return {
        breadcrumbs,
        goHome,
        goTransactions,
        goCards,
        transactionDetailsMatch,
        cardDetailsMatch,
        searchParams,
        homeMatch,
    };
});

export const injectRouterService = () => inject<RouterService>()('routerService');
