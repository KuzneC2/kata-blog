import { useEffect, useState } from 'react';
import styleNewArticle from './NewArticle.module.scss';
import { useForm } from 'react-hook-form';

import { useArticleAddMutation } from '../../redux/defaulApi';
import { useNavigate } from 'react-router-dom';
import { Alert, Flex } from 'antd';

export default function NewArticle() {
  const navigate = useNavigate();
  const [tagList, setTagList] = useState([]);
  const [addNewArticle, { data, isSuccess, isLoading, isError }] = useArticleAddMutation();
  const [sendDisabled, setSendDisabled] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    mode: 'onChange',
  });

  const addNewTag = () => {
    let newTagList = [...tagList, { value: '', id: new Date().getTime() }];
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

  useEffect(() => {
    if (isSuccess) {
      reset();
      navigate('/');
    }
    if (isError) {
      setSendDisabled(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, isLoading, isError]);

  const onSubmit = (value) => {
    setSendDisabled(true);
    const tags = Object.keys(value)
      .filter((key) => key.startsWith('tag'))
      .map((key) => value[key]);
    addNewArticle({
      article: {
        title: value.title,
        description: value.description,
        body: value.body,
        tagList: tags,
      },
    });
  };

  const errorMessage = isError ? (
    <Flex justify="center">
      <Alert message="Something went wrong, try again." type="error" showIcon />
    </Flex>
  ) : null;

  return (
    <>
      {errorMessage}
      <div className={styleNewArticle.formContainer}>
        <h2 className={styleNewArticle.formTitle}>Create new article</h2>

        <form className={styleNewArticle.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styleNewArticle.labelContainer}>
            <label className={styleNewArticle.label}>
              <span className={styleNewArticle.labelSpan}>Title</span>
              <input
                autoComplete="new-password"
                className={`${styleNewArticle.input}`}
                type="text"
                placeholder="Title"
                {...register('title', {
                  required: true,
                })}
              />
            </label>
          </div>

          <div className={styleNewArticle.labelContainer}>
            <label className={styleNewArticle.label}>
              <span className={styleNewArticle.labelSpan}>Short description</span>
              <input
                autoComplete="new-password"
                className={`${styleNewArticle.input}`}
                type="text"
                placeholder="Title"
                {...register('description', {
                  required: true,
                })}
              />
            </label>
          </div>

          <div className={styleNewArticle.labelContainer}>
            <label className={styleNewArticle.label}>
              <span className={styleNewArticle.labelSpan}>Text</span>
              <textarea
                autoComplete="new-password"
                className={`${styleNewArticle.input} ${styleNewArticle.inputArea}`}
                type="text"
                placeholder="Text"
                {...register('body', {
                  required: true,
                })}
              />
            </label>
          </div>

          <div className={styleNewArticle.tagsContainer}>
            <span className={styleNewArticle.labelSpan}>Tags</span>

            <div className={styleNewArticle.tagsList}>
              {tagList.length ? (
                tagList.map((el, index) => (
                  <div className={styleNewArticle.tagContainer} key={el.id}>
                    <input
                      className={`${styleNewArticle.input} ${styleNewArticle.inputTag}`}
                      type="text"
                      defaultValue={el.value}
                      onChange={(e) => changeTag(e, el.id)}
                      {...register(`tag${index}`, {
                        required: true,
                      })}
                    />
                    {index === tagList.length - 1 ? (
                      <>
                        <button className={styleNewArticle.btnDelete} type="button" onClick={() => deleteTag(el.id)}>
                          Delete
                        </button>
                        <button className={styleNewArticle.btnAdd} type="button" onClick={addNewTag}>
                          Add tag
                        </button>
                      </>
                    ) : (
                      <button className={styleNewArticle.btnDelete} type="button" onClick={() => deleteTag(el.id)}>
                        Delete
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <button className={styleNewArticle.btnAdd} type="button" onClick={addNewTag}>
                  Add tag
                </button>
              )}
            </div>
          </div>

          <button
            className={`${styleNewArticle.btnSubmit} ${sendDisabled ? styleNewArticle.btnSubmitDisable : null}`}
            type="submit"
            disabled={sendDisabled}
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
