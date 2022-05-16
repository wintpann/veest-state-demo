import React, { FC, memo } from 'react';
import { styled } from '@mui/material';
import { Skeleton } from '@ui/skeleton/component';
import { countRenderedTimes } from '@/veest';

const StyledSkeleton = {
    Wrapper: styled(Skeleton)``,
    TopBlock: styled('div')`
        padding: 20px;
        display: flex;
        justify-content: space-between;
    `,
    MiddleBlock: styled('div')`
        display: flex;
        justify-content: center;
        padding: 10px;
    `,
    BottomBlock: styled('div')`
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
    `,
    Chip: styled(Skeleton)``,
    Name: styled(Skeleton)``,
    Number: styled(Skeleton)``,
    System: styled(Skeleton)``,
    HolderName: styled(Skeleton)``,
    ValidThru: styled(Skeleton)``,
};

export const CardSkeleton: FC<{ className?: string }> = memo(({ className }) => {
    countRenderedTimes('component');
    return (
        <StyledSkeleton.Wrapper width="350px" height="200px" className={className}>
            <StyledSkeleton.TopBlock>
                <StyledSkeleton.Chip height="35px" width="45px" radius="5px" variant="light" />
                <StyledSkeleton.System height="35px" width="90px" radius="5px" variant="light" />
            </StyledSkeleton.TopBlock>
            <StyledSkeleton.MiddleBlock>
                <StyledSkeleton.Number height="35px" width="310px" radius="5px" variant="light" />
            </StyledSkeleton.MiddleBlock>
            <StyledSkeleton.BottomBlock>
                <StyledSkeleton.HolderName
                    height="30px"
                    width="90px"
                    radius="5px"
                    variant="light"
                />
                <StyledSkeleton.ValidThru height="40px" width="80px" radius="5px" variant="light" />
            </StyledSkeleton.BottomBlock>
        </StyledSkeleton.Wrapper>
    );
});
