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

  const { register, handleSubmit, reset, formState, setError, getValues } = useForm({
    mode: 'onChange',
  });
  const titleError = formState.errors['title']?.message;
  const descriptionError = formState.errors['description']?.message;
  const bodyError = formState.errors['body']?.message;

  const addNewTag = () => {
    let newTagList = [...tagList, { value: '', id: new Date().getTime() }];
    setTagList(newTagList);
  };

  const deleteTag = (id, index) => {
    const newTagList = [...tagList.slice(0, index), ...tagList.slice(index + 1)];
    const updatedTags = { ...getValues() };
    delete updatedTags[`tag${id}`];
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
      setSendDisabled(false);
    } else {
      addNewArticle({
        article: {
          title: value.title,
          description: value.description,
          body: value.body,
          tagList: tags,
        },
      });
    }
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
                className={`${styleNewArticle.input} ${titleError ? styleNewArticle.errorInput : null}`}
                type="text"
                placeholder="Title"
                {...register('title', {})}
              />
            </label>
            {titleError ? <span className={styleNewArticle.error}>{titleError}</span> : null}
          </div>

          <div className={styleNewArticle.labelContainer}>
            <label className={styleNewArticle.label}>
              <span className={styleNewArticle.labelSpan}>Short description</span>
              <input
                autoComplete="new-password"
                className={`${styleNewArticle.input} ${descriptionError ? styleNewArticle.errorInput : null}`}
                type="text"
                placeholder="Title"
                {...register('description', {})}
              />
            </label>
            {descriptionError ? <span className={styleNewArticle.error}>{descriptionError}</span> : null}
          </div>

          <div className={styleNewArticle.labelContainer}>
            <label className={styleNewArticle.label}>
              <span className={styleNewArticle.labelSpan}>Text</span>
              <textarea
                autoComplete="new-password"
                className={`${styleNewArticle.input} ${bodyError ? styleNewArticle.errorInput : null} ${
                  styleNewArticle.inputArea
                } `}
                type="text"
                placeholder="Text"
                {...register('body', {})}
              />
            </label>
            {bodyError ? <span className={styleNewArticle.error}>{bodyError}</span> : null}
          </div>

          <div className={styleNewArticle.tagsContainer}>
            <span className={styleNewArticle.labelSpan}>Tags</span>

            <div className={styleNewArticle.tagsList}>
              {tagList.length ? (
                tagList.map((el, index) => (
                  <div className={styleNewArticle.tagContainer} key={el.id}>
                    <div className={styleNewArticle.tagsInputBox}>
                      <input
                        className={`${styleNewArticle.input} ${styleNewArticle.inputTag} ${
                          formState.errors[`tag${el.id}`] ? styleNewArticle.errorInput : null
                        }`}
                        type="text"
                        defaultValue={el.value}
                        onChange={(e) => changeTag(e, el.id)}
                        {...register(`tag${el.id}`, {
                          // required: true,
                          pattern: {
                            value: /(.|\s)*\S(.|\s)*/,
                            message: 'the field must not be empty',
                          },
                        })}
                      />
                      {formState.errors[`tag${el.id}`] &&
                      (formState.errors[`tag${el.id}`].type === 'required' ||
                        formState.errors[`tag${el.id}`].type === 'pattern') ? (
                        <span className={styleNewArticle.error}>{formState.errors[`tag${el.id}`].message}</span>
                      ) : null}
                    </div>

                    {el.id === tagList[tagList.length - 1].id ? (
                      <>
                        <button
                          className={styleNewArticle.btnDelete}
                          type="button"
                          onClick={() => deleteTag(el.id, index)}
                        >
                          Delete
                        </button>
                        <button className={styleNewArticle.btnAdd} type="button" onClick={() => addNewTag('')}>
                          Add tag
                        </button>
                      </>
                    ) : (
                      <button
                        className={styleNewArticle.btnDelete}
                        type="button"
                        onClick={() => deleteTag(el.id, index)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <button className={styleNewArticle.btnAdd} type="button" onClick={() => addNewTag('')}>
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
