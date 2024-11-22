import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const user = useSelector((state) => state?.user?.user);

  return user.token || localStorage.getItem('user-info') != undefined ? <Outlet /> : <Navigate to={'/sign-in'} />;
}
