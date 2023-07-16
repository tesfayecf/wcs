'use client';

import { redirect, useRouter } from 'next/navigation';
import { IRootState } from '../store/store';
import LoadingPage from '@/app/components/loadingPage/LoadingPage';
import { connect } from 'react-redux';

interface IProps extends ReturnType<typeof mapStateToProps> {
    children: React.ReactNode;
}

const RequireAuth: React.FunctionComponent<IProps> = (props: IProps) => {
    console.log("Render RequireAuth")

    if (props.isLoading) {
        return <LoadingPage />
    }

    if (!props.isAuthenticated) {
        redirect('./login');
    }

    return <>{props.children}</>;
}

export default connect(mapStateToProps)(RequireAuth)

function mapStateToProps(state: IRootState) {
    return {
        isLoading: state.app.loading.isLoading,
        isAuthenticated: state.app.session.isAuthenticated,
    }
}