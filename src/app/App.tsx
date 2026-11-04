import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../widgets/layout/ui/Layout';
import { AppRoutes } from './routes';

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <AppRoutes />
            </Layout>
        </BrowserRouter>
    );
}