import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useGetArticleQuery,
  useArticleDeleteMutation,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from '../../redux/defaulApi';
import { format } from 'date-fns';
import styleArticleFull from './ArticleFull.module.scss';
import Markdown from 'markdown-to-jsx';
import { Flex, Spin, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';

export default function ArticleFull() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const user = JSON.parse(localStorage.getItem('user-info'));
  const [delArticle] = useArticleDeleteMutation();
  const { data, isLoading, error } = useGetArticleQuery(slug, { refetchOnMountOrArgChange: true });

  const [addFavotite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const deleteArticle = () => {
    delArticle(data?.article?.slug);
    navigate('/');
  };

  const deleteLike = async () => {
    try {
      console.log('del');
      await removeFavorite(slug);
    } catch (error) {
      console.log(error);
    }
  };

  const addLike = async () => {
    try {
      console.log('add');
      await addFavotite(slug);
    } catch (error) {
      console.error(error);
    }
  };

  const editingPanel =
    user?.username == data?.article?.author?.username ? (
      <div className={styleArticleFull.editButtons}>
        <Popconfirm
          onConfirm={deleteArticle}
          title="Delete the article"
          description="Are you sure to delete this article?"
          icon={
            <QuestionCircleOutlined
              style={{
                color: 'red',
              }}
            />
          }
        >
          <Button danger>Delete</Button>
        </Popconfirm>

        <Link to={`/articles/${slug}/edit`} className={styleArticleFull.btnEdit}>
          Edit
        </Link>
      </div>
    ) : null;

  if (error)
    return (
      <Flex justify="center">
        <Alert message="There's been some kind of mistake, we're already figuring it out!" type="error" showIcon />
      </Flex>
    );
  if (isLoading)
    return (
      <Flex align="center" justify="center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Flex>
    );

  const liker = data?.article?.favorited ? (
    <span className={`${styleArticleFull.heart} ${styleArticleFull.heart_on}`} onClick={deleteLike}></span>
  ) : (
    <span className={styleArticleFull.heart} onClick={addLike}></span>
  );

  return (
    <>
      <div className={styleArticleFull.articleFullContainer}>
        <div className={styleArticleFull.articleContainer}>
          <div className={styleArticleFull.infoContainer}>
            <div className={styleArticleFull.infoTitleBox}>
              <div className={styleArticleFull.titleBox}>
                <h2 className={styleArticleFull.title}>{data?.article?.title}</h2>
                <label className={styleArticleFull.liker}>
                  {liker}
                  {data?.article?.favoritesCount}
                </label>
              </div>

              <div className={styleArticleFull.tagsBox}>
                {data?.article?.tagList.map((item, index) => (
                  <p className={styleArticleFull.tag} key={index}>
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className={styleArticleFull.userInfo}>
              <div className={styleArticleFull.userDescription}>
                <h2 className={styleArticleFull.userName}>{data?.article?.author?.username}</h2>
                <p className={styleArticleFull.date}>{format(new Date(data?.article?.updatedAt), 'MMM d, yyyy')}</p>
              </div>
              <img className={styleArticleFull.userPic} src={data?.article?.author?.image} alt="аватар" />
            </div>
          </div>
          <div className={styleArticleFull.descriptionPanel}>
            <p className={styleArticleFull.description}>{data?.article?.description}</p>
            {editingPanel}
          </div>
        </div>

        <Markdown className={styleArticleFull.markdown}>{data?.article.body}</Markdown>
      </div>
    </>
  );
}
