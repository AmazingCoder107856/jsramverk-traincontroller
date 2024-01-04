import { Navigate, Outlet } from 'react-router-dom';

function getToken() {
    return sessionStorage.getItem('token');
}

const PrivateRoute = () => {
    let token = getToken();

    if (token === null) {
        return <Navigate to="/login"/>;
    }
    return <Outlet />;
}

export default PrivateRoute;