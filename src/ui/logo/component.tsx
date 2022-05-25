import React, { FC, memo } from 'react';
import { styled } from '@mui/material';
import { countRenderedTimes } from '@/veest';

const Styled = {
    Wrapper: styled('a')`
        font-size: 25px;
        font-weight: bold;
        color: var(--accent-text-color);
        text-decoration: none;
        text-shadow: 0 0 10px black;
        cursor: pointer;
        transition: transform 0.5s;

        &:hover {
            transform: scale(1.2);
        }

        display: flex;
        align-items: center;
        flex-direction: column;
    `,
    Image: styled('img')`
        border-radius: 50%;
        box-shadow: 0 0 10px var(--background-color);
    `,
};

export const Logo: FC = memo(() => {
    countRenderedTimes('component');
    return (
        <Styled.Wrapper href="https://www.npmjs.com/package/veest" target="_blank">
            <Styled.Image
                src="https://raw.githubusercontent.com/wintpann/veest-state/main/logo.png"
                width="80"
                height="80"
                alt="Logo"
            />
        </Styled.Wrapper>
    );
});
