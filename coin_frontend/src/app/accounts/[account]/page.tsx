'use client';

import { useGetAccountQuery } from '@/api/api';
import toast from 'react-hot-toast';
import { Container, Grid, Stack } from '@mui/system';
import { getBalanceTransactions, getLastSixMonthBalance, getNiceBalance } from '@/utils/utils';
import { Typography, Skeleton } from '@mui/material';
import BlueButton from '@/components/Button/BlueButton';
import { useParams, useRouter } from 'next/navigation';
import TransactionForm from '@/components/TransactionForm/TransactionForm';
import TransactionsTable from '@/components/TransactionsTable/TransactionsTable';
import { useEffect, useState } from 'react';
import { TTransactionId } from '@/api/api.types';
import { useDispatch } from 'react-redux';
import { setCurrentAccount } from '@/components/componentsStore';
import TransactionsChart from '@/components/TransactionsChart/TransactionsChart';

export default function AccountPage() {
  const [dataWithId, setDataWithId] = useState<TTransactionId[]>([]);
  const [dataChartAmount, setDataChartAmount] = useState<{ month: string; amount: number }[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const { account } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { data, isSuccess, isFetching, isError } = useGetAccountQuery(account as string, {
    skip: !account,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess) {
      if (data.payload) {
        const dataId = data.payload.transactions.slice(-10).map(tr => ({ ...tr, id: new Date(tr.date).getTime() }));
        setDataWithId(dataId);
      } else if (data.error) {
        toast.error(data.error);
      }
    }
    dispatch(setCurrentAccount(account as string));
  }, [account, data?.error, data?.payload, dispatch, isSuccess]);

  useEffect(() => {
    if (isSuccess) {
      if (data.payload) {
        const amountMonthData = getBalanceTransactions(data, 6, account as string, balance);
        const lastSixMonth = getLastSixMonthBalance();
        const finalData = lastSixMonth.map(item => {
          const transactionData = amountMonthData.find(tr => tr.month === item.month);
          return {
            ...item,
            amount: transactionData ? transactionData.amount : 0,
          };
        });
        setDataChartAmount(finalData);
      } else if (data.error) {
        toast.error(data.error);
      }
    }
  }, [account, balance, data, data?.payload, dispatch, isSuccess]);

  useEffect(() => {
    if (isSuccess && data.payload) {
      setBalance(data.payload.balance);
    }
  }, [data?.payload, isSuccess]);

  if (isFetching) {
    return (
      <Container maxWidth='xl'>
        <Stack spacing={4} paddingTop={'3rem'}>
          <Stack spacing={4} direction='row'>
            <Skeleton variant='rounded' width={'50%'} height={100} />
            <Skeleton variant='rounded' width={'50%'} height={100} />
          </Stack>
          <Stack spacing={2} direction='row'>
            <Skeleton variant='rounded' width={'50%'} height={400} />
            <Skeleton variant='rounded' width={'50%'} height={400} />
          </Stack>
          <Stack spacing={2} direction='row'>
            <Skeleton variant='rounded' width={'100%'} height={400} />
          </Stack>
        </Stack>
      </Container>
    );
  }
  if (isError) toast.error('An error occurred while loading the data');

  return isSuccess ? (
    <Container maxWidth='xl'>
      <Grid container spacing={6} paddingX={'1.563rem'} paddingTop={'3rem'} marginBottom={'3.125rem'} alignItems={'center'}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography fontSize={'2rem'} fontWeight={'bold'}>
            Account
          </Typography>
          <Typography fontSize={'2rem'} paddingTop={'2rem'}>
            № {account}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} textAlign={'right'}>
          <BlueButton text='← Back to accounts' onClick={() => router.push('/accounts')} />
          <Typography fontSize={'1.25rem'} fontWeight={'bold'} paddingTop={'2rem'}>
            Balance <span style={{ paddingLeft: '1rem' }}>{getNiceBalance(balance)}</span>
          </Typography>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2} display={'flex'}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <TransactionForm balance={data.payload ? data.payload.balance : 0} />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }} display={'flex'} height={388}>
              <TransactionsChart chartData={dataChartAmount} showHistoryBnt={true} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <TransactionsTable rows={dataWithId} text={'Last 10 transactions'} isPagination={false} />
        </Grid>
      </Grid>
    </Container>
  ) : (
    <Container maxWidth='xl'>
      <Typography fontSize={'2rem'} fontWeight={'bold'}>
        An error occurred while loading the data. Please, try again later.
      </Typography>
    </Container>
  );
}
