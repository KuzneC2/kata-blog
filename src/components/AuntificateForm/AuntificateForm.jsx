import styleAunth from './AuntificateForm.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useSignInProfileMutation } from '../../redux/defaulApi';
import { useForm } from 'react-hook-form';

import { useDispatch } from 'react-redux';
import { signInUser } from '../../redux/userSlice';
import { Alert, Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

export default function AuntificateForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signIn, { data, isLoading, isSuccess, isError, error }] = useSignInProfileMutation();

  const { register, handleSubmit, formState, reset, setError } = useForm({
    mode: 'onChange',
  });
  const emailError = formState.errors['email']?.message;
  const passwordError = formState.errors['password']?.message;

  useEffect(() => {
    if (isSuccess) {
      dispatch(signInUser(data.user));
      localStorage.setItem('user-info', JSON.stringify(data.user));
      reset();
      navigate('/');
    }
    if (isError) {
      reset();
      setError('email', {
        message: 'invalid password or email',
      });
      setError('password', {
        message: 'invalid password or email',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, isError]);

  const onSubmit = async (value) => {
    signIn(value);
  };
  const errorMessage =
    isError && error.status == 422 ? (
      <Flex justify="center">
        <Alert message="invalid password or email" type="error" showIcon />
      </Flex>
    ) : isError && error.status == 401 ? (
      <Flex justify="center">
        <Alert message="Unauthorized" type="error" showIcon />
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
      <div className={styleAunth.formContainer}>
        <h2 className={styleAunth.formTitle}>Sign In</h2>

        <form className={styleAunth.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styleAunth.labelContainer}>
            <label className={styleAunth.label}>
              <span className={styleAunth.labelSpan}>Email address</span>
              <input
                autoComplete="new-password"
                className={`${styleAunth.input} ${emailError ? styleAunth.errorInput : null}`}
                type="text"
                placeholder="Email address"
                {...register('email', {
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'invalid email address',
                  },
                })}
              />
            </label>
            {emailError ? <span className={styleAunth.error}>{emailError}</span> : null}
          </div>

          <div className={styleAunth.labelContainer}>
            <label className={styleAunth.label}>
              <span className={styleAunth.labelSpan}>Password</span>
              <input
                autoComplete="new-password"
                className={`${styleAunth.input} ${passwordError ? styleAunth.errorInput : null}`}
                type="password"
                placeholder="Password"
                {...register('password', {
                  required: true,
                })}
              />
            </label>
            {passwordError ? <span className={styleAunth.error}>{passwordError}</span> : null}
          </div>

          <button className={styleAunth.btnSubmit} type="submit">
            Login
          </button>

          <p className={styleAunth.description}>
            Already have an account?{' '}
            <Link className={styleAunth.link} to="/sign-up">
              Sign Up.
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
