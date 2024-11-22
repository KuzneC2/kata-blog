import styleArticle from './Article.module.scss';
import { format } from 'date-fns';
import { NavLink, Outlet } from 'react-router-dom';
import avatar from '../../assets/avatar.jpg';

export default function Article({ data, deleteLike, addLike }) {
  const liker = data.favorited ? (
    <span className={`${styleArticle.heart} ${styleArticle.heart_on}`} onClick={() => deleteLike(data.slug)}></span>
  ) : (
    <span className={styleArticle.heart} onClick={() => addLike(data.slug)}></span>
  );

  return (
    <>
      <div className={styleArticle.articleContainer}>
        <div className={styleArticle.infoContainer}>
          <div className={styleArticle.infoTitleBox}>
            <div className={styleArticle.titleBox}>
              <NavLink className={styleArticle.title} to={`/articles/${data.slug}`}>
                {data.title}
              </NavLink>
              <Outlet />
              <label className={styleArticle.liker}>
                {liker}
                {data.favoritesCount}
              </label>
            </div>

            <div className={styleArticle.tagsBox}>
              {data.tagList.map((item, index) => (
                <p className={styleArticle.tag} key={index}>
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className={styleArticle.userInfo}>
            <div className={styleArticle.userDescription}>
              <h2 className={styleArticle.userName}>{data.author.username}</h2>
              <p className={styleArticle.date}>{format(new Date(data.createdAt), 'MMM d, yyyy')}</p>
            </div>
            <img className={styleArticle.userPic} src={data.author.image ? data.author.image : avatar} alt="аватар" />
          </div>
        </div>
        <p className={styleArticle.description}>{data.description}</p>
      </div>
    </>
  );
}
