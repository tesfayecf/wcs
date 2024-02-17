'use client';
import React from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/navigation';
import { IRootState } from '@/app/utils/store/store';

interface IProps extends ReturnType<typeof mapStateToProps> {
    requireAuth: boolean,
    checkAuth: boolean,
    children: React.JSX.Element;
}

const AuthenticationState: React.FunctionComponent<IProps> = (props: IProps) => {
    const router = useRouter();
    React.useEffect(() => {
        if (props.requireAuth && !props.isAuthenticated) {
            router.push('./login');
        }
        if (props.checkAuth && props.isAuthenticated) {
            router.push('./');
        }
    })

    return props.children
}

function mapStateToProps(state: IRootState) {
    return {
        isAuthenticated: state.app.authenticationState.isAuthenticated,
    }
}

export default connect(mapStateToProps, {})(AuthenticationState);
