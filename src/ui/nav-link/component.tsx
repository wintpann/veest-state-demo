import React, { FC, memo } from 'react';
import { NavLinkProps, NavLink as RouterNavLink } from 'react-router-dom';
import { styled } from '@mui/material';
import { countRenderedTimes } from '@/veest';

const Styled = {
    Wrapper: styled(RouterNavLink)`
        color: inherit;
        font-size: inherit;
        text-decoration: none;
    `,
};

export const NavLink: FC<NavLinkProps> = memo((props) => {
    countRenderedTimes('component');
    return <Styled.Wrapper {...props} />;
});
