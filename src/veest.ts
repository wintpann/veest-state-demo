import { configure } from 'veest';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.renderedCount = {
    service: 0,
    component: 0,
    container: 0,
};

export const countRenderedTimes = (location: 'service' | 'component' | 'container') => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.renderedCount[location]++;
};

export const { service, inject, ServiceContainer, container } = configure();
