import { Provider } from 'react-redux';
import { store } from '@/app/utils/store/store';

interface Props {
    children: React.ReactNode;
}

export default function CustomProvider({ children }: Props) {
    return <Provider store={store}>{children}</Provider>;
}
