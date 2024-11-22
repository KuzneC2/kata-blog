import styleHeader from './header.module.scss';
import { NavLink } from 'react-router-dom';
import HeaderSignIn from '../HeaderSignIn/HeaderSignIn.jsx';
import HeaderLogOut from '../HeaderLogOut/HeaderLogOut.jsx';


function Header() {
  return (
    <>
      <div className={styleHeader.header}>
        <NavLink className={styleHeader.title} to="/">
          Realworld Blog
        </NavLink>

        <div className={styleHeader.auntContaineer}>
          <HeaderSignIn />
          <HeaderLogOut />
        </div>
      </div>
    </>
  );
}

export default Header;
