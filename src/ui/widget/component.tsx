import React, { FC, memo } from 'react';
import { styled } from '@mui/material';
import { countRenderedTimes } from '@/veest';

const Styled = {
    Wrapper: styled('div')`
        background-color: var(--widget-color);
        color: var(--text-color);
        height: 100%;
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 5px #111;
    `,
    Content: styled('div')`
        padding: 10px;
        height: 100%;
        width: 100%;
    `,
};

type WidgetProps = {
    transparent?: boolean;
};

export const Widget: FC<WidgetProps> = memo(({ children, transparent }) => {
    countRenderedTimes('component');
    return transparent ? (
        <Styled.Content>{children}</Styled.Content>
    ) : (
        <Styled.Wrapper>
            <Styled.Content>{children}</Styled.Content>
        </Styled.Wrapper>
    );
});
