import Header from '../Header/Header.jsx';
import ArticleList from '../ArticleList/ArticleList.jsx';
import RegisterForm from '../RegisterForm/RegisterForm.jsx';
import AuntificateForm from '../AuntificateForm/AuntificateForm.jsx';
import NoMatch from '../NoMatch/NoMatch.jsx';
import ProfileEdit from '../ProfileEdit/ProfileEdit.jsx';
import ArticleFull from '../ArticleFull/ArticleFull.jsx';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loginStart } from '../../redux/userSlice.js';
import PrivateRoute from '../PrivateRoute/PrivateRoute.jsx';
import NewArticle from '../NewArticle/NewArticle.jsx';
import EditArticle from '../EditArticle/EditArticle.jsx';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem('user-info') != undefined) {
      dispatch(loginStart());
    }
  }, [dispatch]);

  return (
    <>
      <Header />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/new-article" element={<NewArticle />} />
          <Route path="/articles/:slug/edit" element={<EditArticle />} />
        </Route>

        <Route path="/" element={<ArticleList />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:slug" element={<ArticleFull />} />
        <Route path="/sign-up" element={<RegisterForm />} />
        <Route path="/profile" element={<ProfileEdit />} />
        <Route path="/sign-in" element={<AuntificateForm />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}

export default App;
