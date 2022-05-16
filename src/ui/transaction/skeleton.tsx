import React, { FC, memo } from 'react';
import { styled } from '@mui/material';
import { Skeleton } from '@ui/skeleton/component';
import { countRenderedTimes } from '@/veest';

const StyledSkeleton = {
    Wrapper: styled(Skeleton)`
        display: flex;
        align-items: center;
        padding: 10px;
    `,
    DateIcon: styled(Skeleton)`
        margin-right: 10px;
    `,
    Date: styled(Skeleton)``,
    Currency: styled(Skeleton)`
        margin-left: auto;
    `,
    Symbol: styled(Skeleton)`
        margin: 10px;
    `,
    SymbolIcon: styled(Skeleton)``,
};

export const TransactionSkeleton: FC = memo(() => {
    countRenderedTimes('component');
    return (
        <StyledSkeleton.Wrapper height="65px" radius="15px">
            <StyledSkeleton.DateIcon height="45px" width="45px" radius="50%" variant="light" />
            <StyledSkeleton.Date height="20px" width="250px" radius="5px" variant="light" />
            <StyledSkeleton.Currency height="25px" width="60px" radius="5px" variant="light" />
            <StyledSkeleton.Symbol height="20px" width="45px" radius="5px" variant="light" />
            <StyledSkeleton.SymbolIcon height="45px" width="45px" radius="50%" variant="light" />
        </StyledSkeleton.Wrapper>
    );
});
