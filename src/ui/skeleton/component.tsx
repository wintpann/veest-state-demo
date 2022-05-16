import React, { FC, memo } from 'react';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material';
import { countRenderedTimes } from '@/veest';

type SkeletonProps = {
    height?: string;
    width?: string;
    radius?: string;
    variant?: 'dark' | 'light';
    className?: string;
};

const dark = keyframes`
  from {
    background-color: #484848;
  }
  to {
    background-color: #6b6b6b;
  }
`;

const light = keyframes`
  from {
    background-color: #6c6c6c;
  }
  to {
    background-color: #8f8f8f;
  }
`;

const Styled = {
    Skeleton: styled('div')<SkeletonProps>`
        display: block;
        width: ${({ width }) => width ?? '100%'};
        height: ${({ height }) => height ?? '100%'};
        border-radius: ${({ radius }) => radius ?? '15px'};

        animation: ${({ variant }) => (variant === 'dark' ? dark : light)} 1s linear 0s infinite
            alternate;

        &:empty:before {
            content: '';
            display: inline-block;
        }
    `,
};

export const Skeleton: FC<SkeletonProps> = memo(
    ({ height, width, radius, children, variant = 'dark', className }) => {
        countRenderedTimes('component');
        return (
            <Styled.Skeleton
                width={width}
                height={height}
                radius={radius}
                className={className}
                variant={variant}
            >
                {children}
            </Styled.Skeleton>
        );
    },
);
