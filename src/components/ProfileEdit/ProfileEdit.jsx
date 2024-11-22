import { useDispatch, useSelector } from 'react-redux';
import styleEdit from './ProfileEdit.module.scss';
import { useForm } from 'react-hook-form';

import {  useProfileEditMutation } from '../../redux/defaulApi';
import { Alert, Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginStart } from '../../redux/userSlice';

export default function ProfileEdit() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const navigator = useNavigate();

  const { register, handleSubmit, formState, setError } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: user.email,
      username: user.username,
      image: user.image,
    },
  });

  const [profileEdit, { data, isSuccess, isLoading, error, isError }] = useProfileEditMutation();

  const usernameError = formState.errors['username']?.message;
  const emailError = formState.errors['email']?.message;
  const passwordError = formState.errors['password']?.message;
  const imageError = formState.errors['image']?.message;

  const onSubmit = (value) => {

    const updatedData = {};
    for (const key in value) {
      if (value[key] !== '') {
        updatedData[key] = value[key];
      }
    }
    profileEdit(updatedData);
  };

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('user-info', JSON.stringify(data.user));
      dispatch(loginStart());
      navigator('/');
    }
    if (error?.status == 422) {
      if (error?.data?.errors?.email) {
        setError('email', {
          message: 'is already taken.',
        });
      }
      if (error?.data?.errors?.username) {
        setError('username', {
          message: 'is already taken.',
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isSuccess]);

  const errorMessage =
    isError && error.status == 422 ? (
      <Flex justify="center">
        <Alert message="Username or Email is already taken." type="error" showIcon />
      </Flex>
    ) : isError && error.status == 401 ? (
      <Flex justify="center">
        <Alert message="Нужно авторизироваться сначала!" type="error" showIcon />
      </Flex>
    ) : null;

  if (isLoading)
    return (
      <Flex align="center" justify="center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Flex>
    );
  return (
    <>
      {errorMessage}
      <div className={styleEdit.formContainer}>
        <h2 className={styleEdit.formTitle}>Edit Profile</h2>

        <form className={styleEdit.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styleEdit.labelContainer}>
            <label className={styleEdit.label}>
              <span className={styleEdit.labelSpan}>Username</span>
              <input
                className={`${styleEdit.input} ${usernameError ? styleEdit.inputError : null}`}
                autoComplete="new-password"
                type="text"
                placeholder="Username"
                {...register('username', {
                  minLength: {
                    value: 3,
                    message: 'from 3 to 20 characters',
                  },
                  maxLength: {
                    value: 20,
                    message: 'from 3 to 20 characters',
                  },
                })}
              />
            </label>
            {usernameError ? <span className={styleEdit.error}>{usernameError}</span> : null}
          </div>

          <div className={styleEdit.labelContainer}>
            <label className={styleEdit.label}>
              <span className={styleEdit.labelSpan}>Email address</span>
              <input
                className={`${styleEdit.input} ${emailError ? styleEdit.inputError : null}`}
                autoComplete="new-password"
                type="email"
                placeholder="Email address"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'invalid email address',
                  },
                })}
              />
            </label>
            {emailError ? <span className={styleEdit.error}>{emailError}</span> : null}
          </div>

          <div className={styleEdit.labelContainer}>
            <label className={styleEdit.label}>
              <span className={styleEdit.labelSpan}>New password</span>
              <input
                className={`${styleEdit.input} ${passwordError ? styleEdit.inputError : null}`}
                autoComplete="new-password"
                type="password"
                placeholder="New password"
                {...register('password', {
                  required: false,
                  minLength: {
                    value: 6,
                    message: 'from 6 to 40 characters',
                  },
                  maxLength: {
                    value: 40,
                    message: 'from 6 to 40 characters',
                  },
                })}
              />
            </label>
            {passwordError ? <span className={styleEdit.error}>{passwordError}</span> : null}
          </div>

          <div className={`${styleEdit.labelContainer} ${imageError ? styleEdit.inputError : null}`}>
            <label className={styleEdit.label}>
              <span className={styleEdit.labelSpan}>Avatar image (url)</span>
              <input
                className={styleEdit.input}
                autoComplete="new-password"
                type="text"
                placeholder="Avatar image"
                {...register('image', {
                  pattern: {
                    value:
                      /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/i,
                    message: 'enter the address image',
                  },
                })}
              />
            </label>
            {imageError ? <span className={styleEdit.error}>{imageError}</span> : null}
          </div>

          <button className={styleEdit.btnSubmit} type="submit">
            Save
          </button>
        </form>
      </div>
    </>
  );
}
