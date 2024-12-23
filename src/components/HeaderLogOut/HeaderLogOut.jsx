import { Link } from 'react-router-dom';
import styleLogout from './HeaderLogOut.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { articlesApi } from '../../redux/defaulApi.js';
import { logOutUser } from '../../redux/userSlice';
import avatar from '../../assets/avatar.jpg';

export default function HeaderLogOut() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
 
  const logOut = () => {
    dispatch(logOutUser());
    localStorage.removeItem('user-info');
    articlesApi.invalidateTags('Articles');
  };
  
  if (!user?.email) {
    return;
  } else {
    return (
      <>
        <Link className={styleLogout.newPost} to={'/new-article'}>
          Create article
        </Link>
        <Link className={styleLogout.userInfo} to={'/profile'}>
          <h6 className={styleLogout.username}>{user.username}</h6>
          <img className={styleLogout.userimage} src={user?.image ? user?.image : avatar} alt="avatar" />
        </Link>
        <Link className={styleLogout.btnLogout} onClick={logOut} to={'/'}>
          Log Out
        </Link>
      </>
    );
  }
}
