import React from 'react';
import { styled } from '@mui/material';
import { useAction } from 'veest';
import { container, countRenderedTimes } from '@/veest';
import { AuthProps } from '@containers/auth/container';
import { injectCardLookupService } from '@services/card/lookup/service';
import { injectCardListService } from '@services/card/list/service';
import { CardFilter } from '@services/card/type';
import { Button } from '@ui/button/component';
import { SimpleSelect } from '@ui/simple-select/component';
import { injectRouterService } from '@services/router/service';

const Styled = {
    Filter: styled('div')`
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        flex-wrap: wrap;

        .Button {
            flex: 0 0 150px;
            margin: 0 10px;
        }
    `,
    FilterItem: styled('div')`
        flex: 1 0 150px;
        padding: 10px;
    `,
};

export const CardsFilterContainer = container(
    injectCardLookupService(),
    injectCardListService(),
    injectRouterService(),
    (useCardLookupService, useCardListService, useRouterService) =>
        ({ user }: AuthProps) => {
            const { cardsPaginated, setFilter, filter, loadCards } = useCardListService();
            const { goCards } = useRouterService();
            countRenderedTimes('container');

            const { remoteLookup } = useCardLookupService();

            const onSearch = useAction(() => {
                goCards(filter, false);
                loadCards(user.id, filter);
            });

            const onReset = useAction(() => {
                goCards({}, false);
                loadCards(user.id, {});
            });

            return (
                <Styled.Filter>
                    <Styled.FilterItem>
                        <SimpleSelect
                            label="Card ID"
                            items={remoteLookup.data?.cardIDs || []}
                            selected={filter.cardID}
                            onChange={(cardID) => setFilter({ cardID })}
                        />
                    </Styled.FilterItem>
                    <Styled.FilterItem>
                        <SimpleSelect
                            label="Account ID"
                            items={remoteLookup.data?.cardAccounts || []}
                            selected={filter.cardAccount}
                            onChange={(cardAccount) => setFilter({ cardAccount })}
                        />
                    </Styled.FilterItem>
                    <Styled.FilterItem>
                        <SimpleSelect
                            label="Currency"
                            items={remoteLookup.data?.currencies || []}
                            selected={filter.currency}
                            onChange={(currency) => setFilter({ currency })}
                        />
                    </Styled.FilterItem>
                    <Styled.FilterItem>
                        <SimpleSelect
                            label="Status"
                            items={remoteLookup.data?.statuses || []}
                            selected={filter.status}
                            onChange={(status) => setFilter({ status } as CardFilter)}
                        />
                    </Styled.FilterItem>
                    <Button loading={cardsPaginated.loading} onClick={onReset}>
                        Reset
                    </Button>
                    <Button loading={cardsPaginated.loading} onClick={onSearch}>
                        Search
                    </Button>
                </Styled.Filter>
            );
        },
);
