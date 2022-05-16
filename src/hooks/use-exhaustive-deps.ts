import { DependencyList, EffectCallback, useEffect } from 'react';

export const useExhaustiveEffect = (callback: EffectCallback, deps: DependencyList) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(callback, deps);
};
