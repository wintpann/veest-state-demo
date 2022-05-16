import React, { FC } from 'react';
import { container, countRenderedTimes } from '@/veest';
import { injectUserService } from '@services/user/service';
import { User } from '@services/user/type';
import { styled } from '@mui/material';

export type AuthProps = { user: User };

export type AuthContainerProps = {
    Component: FC<AuthProps>;
};

const Styled = {
    Wrapper: styled('div')<{ disabled: boolean }>`
        pointer-events: ${({ disabled }) => (disabled ? 'none' : 'all')};
        filter: ${({ disabled }) => (disabled ? 'blur(3px)' : 'none')};
        border-radius: 10px;
        transition: filter 0.3s;
        height: 100%;
    `,
};

export const AuthContainer = container(
    injectUserService(),
    (useUserService) =>
        ({ Component }: AuthContainerProps) => {
            const { remoteUser } = useUserService();
            countRenderedTimes('container');

            return (
                <>
                    {remoteUser.data ? (
                        <Styled.Wrapper disabled={remoteUser.loading}>
                            <Component user={remoteUser.data} />
                        </Styled.Wrapper>
                    ) : null}
                </>
            );
        },
);
