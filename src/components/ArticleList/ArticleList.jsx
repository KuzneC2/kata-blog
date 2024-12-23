import Article from '../Article/Article.jsx';
import { Pagination, ConfigProvider } from 'antd';

import { useAddFavoriteMutation, useGetArticlesQuery, useRemoveFavoriteMutation } from '../../redux/defaulApi.js';
import { Flex, Spin } from 'antd';
import { Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import styleArticleList from './ArticleList.module.scss';
import { useState } from 'react';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signInUser } from '../../redux/userSlice.js';

export default function ArticleList() {
  const dispatch = useDispatch();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    dispatch(signInUser(userInfo));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [paginate, setPaginate] = useState(1);
  const disArticle = (paginate - 1) * 5;
  const { data = [], isLoading, error } = useGetArticlesQuery(disArticle, { refetchOnMountOrArgChange: true });

  const [addFavotite, { isError }] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const deleteLike = async (slug) => {
    try {
      await removeFavorite(slug);
    } catch (error) {
      console.log(error);
    }
  };

  const addLike = async (slug) => {
    try {
      await addFavotite(slug);
    } catch (error) {
      console.error(error);
    }
  };

  const errorMessage = isError ? <Alert message="Please, log in!" type="warning" showIcon closable /> : null;

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
  return (
    <>
      <div className={styleArticleList.container}>
        {errorMessage}
        {data.articles.map((item) => (
          <Article key={item.slug} data={item} deleteLike={deleteLike} addLike={addLike} />
        ))}

        <ConfigProvider
          theme={{
            components: {
              Pagination: {
                itemActiveBg: '#1890FF',
                itemBg: 'ffffff0',
                colorPrimary: '#fff',
                colorPrimaryHover: '#ffffff70',
              },
            },
          }}
        >
          <Pagination
            align="center"
            current={paginate}
            total={`${(data.articlesCount / 5) * 10}`}
            onChange={(e) => setPaginate(e)}
            showSizeChanger={false}
          />
        </ConfigProvider>
      </div>
    </>
  );
}
