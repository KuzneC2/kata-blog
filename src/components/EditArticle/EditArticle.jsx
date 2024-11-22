import { useForm } from 'react-hook-form';
import styleEditArticle from './EditArticle.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useArticleEditMutation, useGetArticleQuery } from '../../redux/defaulApi';
import { nanoid } from 'nanoid';
import { Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function EditArticle() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data } = useGetArticleQuery(slug);

  const [tagList, setTagList] = useState([]);
  const [sendEdit, result] = useArticleEditMutation();

  const { register, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: data?.article?.title,
      description: data?.article?.description,
      body: data?.article?.body,
    },
  });

  const startTags = (data) => {
    if (data) {
      const newTagList = data.map((el) => ({
        value: el,
        id: nanoid(),
      }));
      setTagList(newTagList);
    }
  };

  const addNewTag = (value = '') => {
    let newTagList = [...tagList, { value, id: nanoid() }];
    setTagList(newTagList);
  };
  
  const deleteTag = (id) => {
    const newTagList = tagList.filter((el) => el.id !== id);
    setTagList(newTagList);
  };

  const changeTag = (e, id) => {
    const newTagList = tagList.map((el) => {
      if (el.id == id) {
        return { ...el, value: e.target.value };
      } else return el;
    });
    setTagList(newTagList);
  };

  const onSubmit = (value) => {
    const tags = Object.keys(value)
      .filter((key) => key.startsWith('tag'))
      .map((key) => value[key]);
    sendEdit({
      slug,
      body: {
        article: {
          title: value.title,
          description: value.description,
          body: value.body,
          tagList: tags,
        },
      },
    });
  };

  useEffect(() => {
    if (result.isSuccess) {
      navigate('/');
    }
  }, [result.isSuccess]);

  useEffect(() => {
    reset({
      title: data?.article?.title,
      description: data?.article?.description,
      body: data?.article?.body,
    });

    startTags(data?.article?.tagList);
  }, [data]);

  if (result.isLoading)
    return (
      <Flex align="center" justify="center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Flex>
    );

  return (
    <>
      <div className={styleEditArticle.formContainer}>
        <h2 className={styleEditArticle.formTitle}>Create new article</h2>

        <form className={styleEditArticle.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styleEditArticle.labelContainer}>
            <label className={styleEditArticle.label}>
              <span className={styleEditArticle.labelSpan}>Title</span>
              <input
                autoComplete="new-password"
                className={`${styleEditArticle.input}`}
                type="text"
                placeholder="Title"
                {...register('title', {
                  required: true,
                })}
              />
            </label>
          </div>

          <div className={styleEditArticle.labelContainer}>
            <label className={styleEditArticle.label}>
              <span className={styleEditArticle.labelSpan}>Short description</span>
              <input
                autoComplete="new-password"
                className={`${styleEditArticle.input}`}
                type="text"
                placeholder="Title"
                {...register('description', {
                  required: true,
                })}
              />
            </label>
          </div>

          <div className={styleEditArticle.labelContainer}>
            <label className={styleEditArticle.label}>
              <span className={styleEditArticle.labelSpan}>Text</span>
              <textarea
                autoComplete="new-password"
                className={`${styleEditArticle.input} ${styleEditArticle.inputArea}`}
                type="text"
                placeholder="Text"
                {...register('body', {
                  required: true,
                })}
              />
            </label>
          </div>

          <div className={styleEditArticle.tagsContainer}>
            <span className={styleEditArticle.labelSpan}>Tags</span>

            <div className={styleEditArticle.tagsList}>
              {tagList.length ? (
                tagList.map((el) => (
                  <div className={styleEditArticle.tagContainer} key={el.id}>
                    <input
                      className={`${styleEditArticle.input} ${styleEditArticle.inputTag}`}
                      type="text"
                      defaultValue={el.value}
                      onChange={(e) => changeTag(e, el.id)}
                      {...register(`tag${el.id}`, {
                        required: true,
                      })}
                    />
                    {el.id === tagList[tagList.length - 1].id ? (
                      <>
                        <button className={styleEditArticle.btnDelete} type="button" onClick={() => deleteTag(el.id)}>
                          Delete
                        </button>
                        <button className={styleEditArticle.btnAdd} type="button" onClick={() => addNewTag('')}>
                          Add tag
                        </button>
                      </>
                    ) : (
                      <button className={styleEditArticle.btnDelete} type="button" onClick={() => deleteTag(el.id)}>
                        Delete
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <button className={styleEditArticle.btnAdd} type="button" onClick={() => addNewTag('')}>
                  Add tag
                </button>
              )}
            </div>
          </div>

          <button className={styleEditArticle.btnSubmit} type="submit">
            Send
          </button>
        </form>
      </div>
    </>
  );
}
