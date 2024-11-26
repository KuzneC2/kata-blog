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

  const { register, handleSubmit, reset, formState, setError, getValues } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: data?.article?.title,
      description: data?.article?.description,
      body: data?.article?.body,
    },
  });

  const titleError = formState.errors['title']?.message;
  const descriptionError = formState.errors['description']?.message;
  const bodyError = formState.errors['body']?.message;

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
    console.log(newTagList);
    setTagList(newTagList);
  };

  const deleteTag = (id, index) => {
    const newTagList = [...tagList.slice(0, index), ...tagList.slice(index + 1)];
    const updatedTags = { ...getValues() };
    delete updatedTags[`tag${id}`]; // удаление ключа из формы value
    reset({
      ...updatedTags,
    });
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

    if (
      value.title.trim().length == 0 ||
      !value.title ||
      value.description.trim().length == 0 ||
      !value.description ||
      value.body.trim().length == 0 ||
      !value.body
    ) {
      if (value.title.trim().length == 0 || !value.title) {
        setError('title', {
          message: 'the field must be filled in',
        });
      }
      if (value.description.trim().length == 0 || !value.description) {
        setError('description', {
          message: 'the field must be filled in',
        });
      }
      if (value.body.trim().length == 0 || !value.body) {
        setError('body', {
          message: 'the field must be filled in',
        });
      }
    } else {
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
    }
  };

  useEffect(() => {
    if (result.isSuccess) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.isSuccess]);

  useEffect(() => {
    reset({
      title: data?.article?.title,
      description: data?.article?.description,
      body: data?.article?.body,
    });

    startTags(data?.article?.tagList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <h2 className={styleEditArticle.formTitle}>Edit article</h2>

        <form className={styleEditArticle.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styleEditArticle.labelContainer}>
            <label className={styleEditArticle.label}>
              <span className={styleEditArticle.labelSpan}>Title</span>
              <input
                autoComplete="new-password"
                className={`${styleEditArticle.input} ${titleError ? styleEditArticle.errorInput : null}`}
                type="text"
                placeholder="Title"
                {...register('title', {})}
              />
            </label>
            {titleError ? <span className={styleEditArticle.error}>{titleError}</span> : null}
          </div>

          <div className={styleEditArticle.labelContainer}>
            <label className={styleEditArticle.label}>
              <span className={styleEditArticle.labelSpan}>Short description</span>
              <input
                autoComplete="new-password"
                className={`${styleEditArticle.input} ${descriptionError ? styleEditArticle.errorInput : null}`}
                type="text"
                placeholder="Title"
                {...register('description', {})}
              />
            </label>
            {descriptionError ? <span className={styleEditArticle.error}>{descriptionError}</span> : null}
          </div>

          <div className={styleEditArticle.labelContainer}>
            <label className={styleEditArticle.label}>
              <span className={styleEditArticle.labelSpan}>Text</span>
              <textarea
                autoComplete="new-password"
                className={`${styleEditArticle.input} ${bodyError ? styleEditArticle.errorInput : null} ${
                  styleEditArticle.inputArea
                } `}
                type="text"
                placeholder="Text"
                {...register('body', {})}
              />
            </label>
            {bodyError ? <span className={styleEditArticle.error}>{bodyError}</span> : null}
          </div>

          <div className={styleEditArticle.tagsContainer}>
            <span className={styleEditArticle.labelSpan}>Tags</span>

            <div className={styleEditArticle.tagsList}>
              {tagList.length ? (
                tagList.map((el, index) => (
                  <div className={styleEditArticle.tagContainer} key={el.id}>
                    <div className={styleEditArticle.tagsInputBox}>
                      <input
                        className={`${styleEditArticle.input} ${styleEditArticle.inputTag}`}
                        type="text"
                        defaultValue={el.value}
                        onChange={(e) => changeTag(e, el.id)}
                        {...register(`tag${el.id}`, {
                          required: true,
                          pattern: {
                            value: /(.|\s)*\S(.|\s)*/,
                            message: 'the field must not be empty',
                          },
                        })}
                      />
                      {formState.errors[`tag${el.id}`] &&
                      (formState.errors[`tag${el.id}`].type === 'required' ||
                        formState.errors[`tag${el.id}`].type === 'pattern') ? (
                        <span className={styleEditArticle.error}>{formState.errors[`tag${el.id}`].message}</span>
                      ) : null}
                    </div>

                    {el.id === tagList[tagList.length - 1].id ? (
                      <>
                        <button
                          className={styleEditArticle.btnDelete}
                          type="button"
                          onClick={() => deleteTag(el.id, index)}
                        >
                          Delete
                        </button>
                        <button className={styleEditArticle.btnAdd} type="button" onClick={() => addNewTag('')}>
                          Add tag
                        </button>
                      </>
                    ) : (
                      <button
                        className={styleEditArticle.btnDelete}
                        type="button"
                        onClick={() => deleteTag(el.id, index)}
                      >
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
