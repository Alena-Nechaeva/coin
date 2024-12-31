'use client';

import { Container, Grid } from '@mui/system';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import SubmitButton from '@/components/Button/SubmitButton';
import EyeOpen from '@/components/icons/EyeOpen';
import EyeClose from '@/components/icons/EyeClose';
import { useLoginMutation } from '@/api/api';

const noSpaces = (fieldName: string) => ({
  name: 'no-spaces',
  message: `${fieldName} cannot contain spaces`,
  test: (value: string | undefined | null) => {
    if (!value) return true;
    return !/\s/.test(value);
  },
});

const schemaLogIn = yup.object().shape({
  login: yup.string().min(6, 'Name must contain at least 6 characters').test(noSpaces('Name')).required('Name is required'),
  password: yup.string().min(6, 'Password must contain at least 6 characters').test(noSpaces('Password')).required('Password is required'),
});

export default function LogInPage() {
  const [loadingBtnState, setLoadingBtnState] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<yup.InferType<typeof schemaLogIn>>({
    mode: 'onTouched',
    resolver: yupResolver(schemaLogIn),
  });

  const [login] = useLoginMutation();
  const onSubmit: SubmitHandler<yup.InferType<typeof schemaLogIn>> = async params => {
    setLoadingBtnState(true);
    try {
      const responseLogin = await login(params).unwrap();

      if (responseLogin.payload) {
        window.localStorage.setItem('accessToken', responseLogin.payload.token);
        toast.success('User logged in successfully');
        router.push('/accounts');
      } else if (responseLogin.error !== '') {
        toast.error(responseLogin.error);
      }
    } catch (err: any) {
      console.log(err);
      localStorage.removeItem('accessToken');
    } finally {
      setLoadingBtnState(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) router.push('/');
  }, [router]);

  return (
    <Container component='main' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '93vh' }}>
      <Paper elevation={6} sx={{ maxWidth: '32rem', backgroundColor: 'grey.100', padding: '3.125rem', borderRadius: '50px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid size={12}>
              <Typography color={'main.dark'} fontSize={'2.125rem'} fontWeight={700} textAlign={'center'}>
                Log in to your account
              </Typography>
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth>
                <Controller
                  name='login'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value || ''}
                      label='Name'
                      onChange={onChange}
                      placeholder='Name'
                      error={Boolean(errors.login)}
                    />
                  )}
                />
                {errors.login && (
                  <FormHelperText sx={{ color: 'error.main', position: 'absolute', bottom: -20 }}>{errors.login.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth>
                <Controller
                  name='password'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <InputLabel htmlFor='inputPassword' error={Boolean(errors.password)}>
                        Password
                      </InputLabel>
                      <OutlinedInput
                        fullWidth
                        id='inputPassword'
                        value={value || ''}
                        label='Password'
                        onChange={onChange}
                        placeholder='Name'
                        error={Boolean(errors.password)}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton edge='end' onMouseDown={e => e.preventDefault()} onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOpen /> : <EyeClose />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </>
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main', position: 'absolute', bottom: -20 }}>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={12}>
              <SubmitButton loadingBtnState={loadingBtnState} text='Log In' />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
