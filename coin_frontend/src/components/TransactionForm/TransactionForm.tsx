'use client';

import { Grid } from '@mui/system';
import { FormControl, FormHelperText, Paper, TextField, Typography, Autocomplete } from '@mui/material';
import { useParams } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import SubmitButton from '@/components/Button/SubmitButton';
import { useTransferFundsMutation } from '@/api/api';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { detectCardType } from '@/utils/utils';

const schemaTransaction = yup.object().shape({
  currentAccount: yup.string().required(),
  to: yup
    .string()
    .matches(/^\d+$/, 'Only numbers are allowed')
    .test('not-current', `The recipient’s account cannot match the sender’s account`, function (value) {
      const { currentAccount } = this.parent;
      return value !== currentAccount;
    })
    .required('A recipient account is required'),
  balance: yup.number().required(),
  amount: yup
    .string()
    .matches(/^\d+(\.\d+)?$/, 'Only numbers, and a dot are allowed')
    .test('balance-available', 'The amount entered exceeds the available balance', function (value) {
      const { balance } = this.parent;
      return !!(value && value <= balance);
    })
    .test('moreThan-zero', 'Amount should be more than 0', function (value) {
      if (value) return parseFloat(value) > 0;
      return false;
    })
    .required('Amount is required'),
});

export default function TransactionForm({ balance }: { balance: number }) {
  const [loadingBtnState, setLoadingBtnState] = useState<boolean>(false);
  const destinations = JSON.parse(localStorage.getItem('destinations') || '[]');
  const [recipientAccount, setRecipientAccount] = useState<string>('');
  const [accountSuggestions, setAccountSuggestions] = useState<string[]>([]);
  const [cardType, setCardType] = useState<string | null>(null);
  const { account } = useParams();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<yup.InferType<typeof schemaTransaction>>({
    mode: 'onTouched',
    resolver: yupResolver(schemaTransaction),
  });

  const saveRecipientAccount = (account: string) => {
    const updatedAccounts = Array.from(new Set([account, ...accountSuggestions]));
    setAccountSuggestions(updatedAccounts);
    localStorage.setItem('destinations', JSON.stringify(updatedAccounts));
  };

  const [transferFunds] = useTransferFundsMutation();
  const onSubmit: SubmitHandler<yup.InferType<typeof schemaTransaction>> = async params => {
    setLoadingBtnState(true);
    try {
      const response = await transferFunds({ from: account as string, to: params.to, amount: parseFloat(params.amount) }).unwrap();
      if (response && response.payload) {
        saveRecipientAccount(recipientAccount);
        toast.success('Transaction is done successfully');
      } else if (response && response.error !== '') {
        toast.error(response.error);
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoadingBtnState(false);
    }
  };

  useEffect(() => {
    const savedAccounts = JSON.parse(localStorage.getItem('destinations') || '[]');
    setAccountSuggestions(savedAccounts);
  }, []);

  useEffect(() => {
    setValue('to', recipientAccount);
    setValue('balance', balance);
    setValue('currentAccount', account as string);
  }, [account, balance, recipientAccount, setValue]);

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'grey.100', padding: '1.563rem 3.125rem', borderRadius: '50px' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid size={12}>
            <Typography color={'main.dark'} fontSize={'1.25rem'} fontWeight={700}>
              New transaction
            </Typography>
          </Grid>
          <Grid size={12}>
            <Grid container spacing={1}>
              <Grid size={11}>
                <FormControl fullWidth>
                  <Controller
                    name='to'
                    control={control}
                    render={({}) => (
                      <Autocomplete
                        freeSolo
                        options={destinations}
                        value={recipientAccount}
                        onInputChange={(event, newValue) => {
                          setRecipientAccount(newValue);
                          setCardType(detectCardType(newValue));
                        }}
                        renderInput={params => <TextField {...params} label='Recipient`s account number' />}
                      />
                    )}
                  />
                  {errors.to && (
                    <FormHelperText sx={{ color: 'error.main', position: 'absolute', bottom: -20 }}>{errors.to.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={1} display='flex' alignItems='center'>
                {cardType ? <Image src={`/card-logos/${cardType}.svg`} alt={`${cardType} logo`} width={50} height={50} /> : <></>}
              </Grid>
            </Grid>
          </Grid>
          <Grid size={11.1}>
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
                <FormHelperText sx={{ color: 'error.main', position: 'absolute', bottom: -20 }}>{errors.amount.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={12}>
            <SubmitButton loadingBtnState={loadingBtnState} startIcon={true} text={'Send'} />
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
