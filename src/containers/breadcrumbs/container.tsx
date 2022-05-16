import React from 'react';
import { container, countRenderedTimes } from '@/veest';
import { injectRouterService } from '@services/router/service';
import { Breadcrumbs } from '@ui/breadcrumbs/component';

export const BreadcrumbsContainer = container(injectRouterService(), (useRouterService) => () => {
    const { breadcrumbs } = useRouterService();
    countRenderedTimes('container');

    return <Breadcrumbs items={breadcrumbs} />;
});
