import { Autocomplete, FormControl, FormHelperText, Paper, TextField, Typography } from '@mui/material';
import { Grid } from '@mui/system';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useExchangeCurrencyMutation, useGetAllCurrenciesQuery } from '@/api/api';
import toast from 'react-hot-toast';
import SubmitButton from '@/components/Button/SubmitButton';

const schemaCurrency = yup.object().shape({
  to: yup.string().required('Code is required'),
  from: yup.string().required('Code is required'),
  amount: yup
    .string()
    .matches(/^\d+(\.\d+)?$/, 'Only numbers, and a dot are allowed')
    .test('moreThan-zero', 'Amount should be more than 0', function (value) {
      if (value) return parseFloat(value) > 0;
      return false;
    })
    .required('Amount is required'),
});

export default function ExchangeCurrencyForm() {
  const [toValue, setToValue] = useState<string | null>(null);
  const [fromValue, setFromValue] = useState<string | null>(null);
  const [loadingBtnState, setLoadingBtnState] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<yup.InferType<typeof schemaCurrency>>({
    mode: 'onTouched',
    resolver: yupResolver(schemaCurrency),
  });

  const { data, isSuccess, isError } = useGetAllCurrenciesQuery();
  useEffect(() => {
    if (isSuccess && data.error) {
      toast.error(data.error);
    }
  }, [data?.error, isSuccess]);

  const handleCurrencyCodeChange = (_event: SyntheticEvent<Element, Event>, value: string | null, dir: 'to' | 'from') => {
    if (dir === 'to') {
      setToValue(value);
      setValue('to', value ? value : '');
    } else {
      setFromValue(value);
      setValue('from', value ? value : '');
    }
    clearErrors();
  };

  const [exchangeCurrency] = useExchangeCurrencyMutation();
  const onSubmit: SubmitHandler<yup.InferType<typeof schemaCurrency>> = async params => {
    setLoadingBtnState(true);
    try {
      const response = await exchangeCurrency({ from: params.from, to: params.to, amount: parseFloat(params.amount) }).unwrap();
      if (response.payload) {
        toast.success('Transaction is done successfully');
        reset();
        setToValue(null);
        setFromValue(null);
      } else if (response.error !== '') {
        toast.error(response.error);
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoadingBtnState(false);
    }
  };

  if (isError) toast.error('An error occurred while loading currencies data');

  return (
    <Paper elevation={6} sx={{ padding: '1.563rem 2.125rem', borderRadius: '50px', width: '100%' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid size={12}>
            <Typography color={'main.dark'} fontSize={'1.25rem'} fontWeight={700}>
              Currency exchange
            </Typography>
          </Grid>
          <Grid size={12}>
            <Grid container spacing={4} flexDirection={'row'}>
              <Grid size={8}>
                <Grid container spacing={4}>
                  <Grid size={6}>
                    <FormControl fullWidth>
                      <Controller
                        name='from'
                        control={control}
                        render={({}) => (
                          <Autocomplete
                            fullWidth
                            value={fromValue}
                            options={isSuccess ? data.payload : []}
                            onChange={(e, newValaue) => handleCurrencyCodeChange(e, newValaue, 'from')}
                            getOptionLabel={option => option}
                            openOnFocus
                            clearText='Clear'
                            openText='Open'
                            noOptionsText={'No Options'}
                            renderInput={params => <TextField {...params} label='From currency' />}
                          />
                        )}
                      />
                      {errors.from && (
                        <FormHelperText sx={{ color: 'error.main', position: 'absolute', bottom: -17 }}>
                          {errors.from.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={6}>
                    <FormControl fullWidth>
                      <Controller
                        name='to'
                        control={control}
                        render={({}) => (
                          <Autocomplete
                            fullWidth
                            value={toValue}
                            options={isSuccess ? data.payload : []}
                            onChange={(e, newValaue) => handleCurrencyCodeChange(e, newValaue, 'to')}
                            getOptionLabel={option => option}
                            openOnFocus
                            clearText='Clear'
                            openText='Open'
                            noOptionsText={'No Options'}
                            renderInput={params => <TextField {...params} label='To currency' />}
                          />
                        )}
                      />
                      {errors.to && (
                        <FormHelperText sx={{ color: 'error.main', position: 'absolute', bottom: -17 }}>{errors.to.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='amount'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            fullWidth
                            value={value || ''}
                            label='Amount'
                            onChange={onChange}
                            placeholder='Amount'
                            error={Boolean(errors.amount)}
                          />
                        )}
                      />
                      {errors.amount && (
                        <FormHelperText sx={{ color: 'error.main', position: 'absolute', bottom: -20 }}>
                          {errors.amount.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={4}>
                <SubmitButton text={'Exchange Currency'} loadingBtnState={loadingBtnState} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
