import { useParams } from 'react-router-dom';
import { useGetArticleQuery } from '../../redux/defaulApi';
import { format } from 'date-fns';
import styleArticleFull from './ArticleFull.module.scss';
import Markdown from 'markdown-to-jsx';
import { Flex, Spin, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
export default function ArticleFull() {
  const { slug } = useParams();

  const { data, isLoading, error } = useGetArticleQuery(slug, { refetchOnMountOrArgChange: true });
  console.log(data);



  
  if (error)
    return (
      <Flex justify="center">
        <Alert message="Произошла какая-то ошибка, мы уже разбираемся!" type="error" showIcon />
      </Flex>
    );
  if (isLoading)
    return (
      <Flex align="center" justify="center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Flex>
    );
  return (
    <>
      <div className={styleArticleFull.articleFullContainer}>
        <div className={styleArticleFull.articleContainer}>
          <div className={styleArticleFull.infoContainer}>
            <div className={styleArticleFull.infoTitleBox}>
              <div className={styleArticleFull.titleBox}>
                <h2 className={styleArticleFull.title}>{data.article.title}</h2>
                <label className={styleArticleFull.liker}>
                  <input className={styleArticleFull.input} type="checkbox" checked={data.article.favorited} />
                  <span className={styleArticleFull.heart}></span>
                  {data.article.favoritesCount}
                </label>
              </div>

              <div className={styleArticleFull.tagsBox}>
                {data.article.tagList.map((item, index) => (
                  <p className={styleArticleFull.tag} key={index}>
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className={styleArticleFull.userInfo}>
              <div className={styleArticleFull.userDescription}>
                <h2 className={styleArticleFull.userName}>{data.article.author.username}</h2>
                <p className={styleArticleFull.date}>{format(new Date(data.article.updatedAt), 'MMM d, yyyy')}</p>
              </div>
              <img className={styleArticleFull.userPic} src={data.article.author.image} alt="аватар" />
            </div>
          </div>
          <p className={styleArticleFull.description}>{data.article.description}</p>
        </div>

        <Markdown className={styleArticleFull.markdown}>{data.article.body}</Markdown>
      </div>
    </>
  );
}
