import { NavLink } from 'react-router-dom';
import styleHeaderSignIn from './styleHeaderSignIn.module.scss';
import { useSelector } from 'react-redux';

export default function HeaderSignIn() {
  const user = useSelector((state) => state?.user?.user);
  if (!user?.email) {
    return (
      <>
        <NavLink className={styleHeaderSignIn.auntBtn} to="/sign-in">
          Sign In
        </NavLink>
        <NavLink className={styleHeaderSignIn.regBtn} to="/sign-up">
          Sign Up
        </NavLink>
      </>
    );
  }
  return;
}
