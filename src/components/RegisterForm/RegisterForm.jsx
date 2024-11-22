import styleRegister from './RegisterForm.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useRegisterProfileMutation } from '../../redux/defaulApi';
import { Alert, Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [registerUser, { data, isSuccess, isLoading, isError, error }] = useRegisterProfileMutation();

  const { register, handleSubmit, formState, reset, watch, setError } = useForm({
    mode: 'onChange',
  });
  const usernameError = formState.errors['username']?.message;
  const emailError = formState.errors['email']?.message;
  const passwordError = formState.errors['password']?.message;
  const passwordRepeatError = formState.errors['repeatPassword']?.message;
  const acceptError = formState.errors['accept']?.message;

  useEffect(() => {
    if (isSuccess) {
      reset();
      navigate('/');
    }

    if (error?.status == 422) {
      if (error?.data?.errors?.email.length) {
        setError('email', {
          message: 'is already taken',
        });
      }
      if (error?.data?.errors?.username.length) {
        setError('username', {
          message: 'is already taken',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isLoading, isSuccess]);

  const onSubmit = (data) => {
    registerUser(data);
  };

  const errorMessage = isError ? (
    <Flex justify="center">
      <Alert message="username or ermail is already taken." type="error" showIcon />
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
      <div className={styleRegister.formContainer}>
        <h2 className={styleRegister.formTitle}>Create new account </h2>

        <form className={styleRegister.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styleRegister.labelContainer}>
            <label className={styleRegister.label}>
              <span className={styleRegister.labelSpan}>Username</span>
              <input
                autoComplete="new-password"
                className={`${styleRegister.input} ${usernameError ? styleRegister.inputError : null}`}
                type="text"
                placeholder="Username"
                {...register('username', {
                  required: true,
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
            {usernameError ? <span className={styleRegister.error}>{usernameError}</span> : null}
          </div>

          <div className={styleRegister.labelContainer}>
            <label className={styleRegister.label}>
              <span className={styleRegister.labelSpan}>Email address</span>
              <input
                autoComplete="new-password"
                className={`${styleRegister.input} ${emailError ? styleRegister.inputError : null}`}
                type="email"
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
            {emailError ? <span className={styleRegister.error}>{emailError}</span> : null}
          </div>

          <div className={styleRegister.labelContainer}>
            <label className={styleRegister.label}>
              <span className={styleRegister.labelSpan}>Password</span>
              <input
                autoComplete="new-password"
                className={`${styleRegister.input} ${passwordError ? styleRegister.inputError : null}`}
                type="password"
                placeholder="Password"
                {...register('password', {
                  required: true,
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
            {passwordError ? <span className={styleRegister.error}>{passwordError}</span> : null}
          </div>

          <div className={styleRegister.labelContainer}>
            <label className={styleRegister.label}>
              <span className={styleRegister.labelSpan}>Repeat Password</span>
              <input
                autoComplete="new-password"
                className={`${styleRegister.input} ${passwordRepeatError ? styleRegister.inputError : null}`}
                type="password"
                placeholder="Repeat Password"
                {...register('repeatPassword', {
                  required: true,

                  validate: (val) => {
                    if (watch('password') !== val) {
                      return 'Your passwords do no match';
                    }
                  },
                })}
              />
            </label>
            {passwordRepeatError ? <span className={styleRegister.error}>{passwordRepeatError}</span> : null}
          </div>

          <div className={styleRegister.labelContainer}>
            <label className={styleRegister.labelCheckbox}>
              <input
                className={styleRegister.inputCheck}
                type="checkbox"
                {...register('accept', {
                  required: true,
                })}
              />
              <span className={styleRegister.checkbox}></span>
              <span className={styleRegister.labelSpanCheck}>I agree to the processing of my personal information</span>
            </label>
            {acceptError ? <span className={styleRegister.error}>{acceptError}</span> : null}
          </div>
          <button className={styleRegister.btnSubmit} type="submit">
            Create
          </button>

          <p className={styleRegister.description}>
            Already have an account?{' '}
            <Link className={styleRegister.link} to="/sign-in">
              Sign In.
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
