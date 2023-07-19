'use client';
import { connect } from 'react-redux';
import { useRouter } from 'next/navigation';
import { IRootState } from '../store/store';
import LoadingPage from '@/app/components/loadingPage/LoadingPage';

interface IProps extends ReturnType<typeof mapStateToProps> {
    children: React.JSX.Element;
}

const RequireAuth: React.FunctionComponent<IProps> = (props: IProps) => {
    // if (process.env.NODE_ENV === "development") {
    //     return <>{props.children}</>;
    // }

    const router = useRouter();
    if (props.isLoading) return <LoadingPage />
    if (!props.isAuthenticated) router.push('./login');
    return <>{props.children}</>;
}

function mapStateToProps(state: IRootState) {
    return {
        isLoading: state.app.loading.isLoading,
        isAuthenticated: state.app.session.isAuthenticated,
    }
}

export default connect(mapStateToProps, {})(RequireAuth)