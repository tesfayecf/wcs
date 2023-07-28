'use client';
import { connect } from 'react-redux';
import { useRouter } from 'next/navigation';
import { IRootState } from '../store/store';
import LoadingPage from '@/app/components/loadingPage/LoadingPage';

interface IProps extends ReturnType<typeof mapStateToProps> {
    children: React.JSX.Element;
}

const CheckAuth: React.FunctionComponent<IProps> = (props: IProps) => {
    const router = useRouter()
    if (props.isLoading) return <LoadingPage />
    if (props.isAuthenticated) router.push('./dashboard');
    return <>{props.children}</>;
}

function mapStateToProps(state: IRootState) {
    return {
        isLoading: state.app.loading.isLoading,
        isAuthenticated: state.app.session.isAuthenticated,
    }
}

export default connect(mapStateToProps, {})(CheckAuth)