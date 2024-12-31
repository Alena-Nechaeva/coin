'use client';

import { useEffect, useState } from 'react';
import { TTransactionId } from '@/api/api.types';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useGetAccountQuery } from '@/api/api';
import {
  getBalanceTransactions,
  getIncomeOutcomeTransactions,
  getLastTwelveMonthBalance,
  getLastTwelveMonthIncomeOutcome,
  getNiceBalance,
} from '@/utils/utils';
import { Container, Grid, Stack } from '@mui/system';
import { Skeleton, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import BlueButton from '@/components/Button/BlueButton';
import TransactionsChart from '@/components/TransactionsChart/TransactionsChart';
import TransactionsTable from '@/components/TransactionsTable/TransactionsTable';
import IncomeOutcomeChart from '@/components/IncomeOutcomeChart/IncomeOutcomeChart';
import { setCurrentAccount } from '@/components/componentsStore';

export default function HistoryPage() {
  const [dataWithId, setDataWithId] = useState<TTransactionId[]>([]);
  const [dataBalanceChart, setDataBalanceChart] = useState<{ month: string; amount: number }[]>([]);
  const [dataIncomeOutcomeChart, setDataIncomeOutcomeChart] = useState<{ month: string; income: number; outcome: number }[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const { account } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { data, isSuccess, isFetching, isError } = useGetAccountQuery(account as string, { skip: !account });

  useEffect(() => {
    if (isSuccess) {
      if (data.payload) {
        const dataId = data.payload.transactions.map(tr => ({ ...tr, id: new Date(tr.date).getTime() }));
        setDataWithId(dataId);
      } else if (data.error) {
        toast.error(data.error);
      }
    }
    dispatch(setCurrentAccount(account as string));
  }, [account, data?.error, data?.payload, dispatch, isSuccess]);

  useEffect(() => {
    if (isSuccess && data.payload) {
      setBalance(data.payload.balance);
    }
  }, [data?.payload, isSuccess]);

  useEffect(() => {
    if (isSuccess) {
      if (data.payload) {
        const amountMonthData = getBalanceTransactions(data, 12, account as string, balance);
        const lastTwelveMonth = getLastTwelveMonthBalance();
        const finalBalanceData = lastTwelveMonth.map(item => {
          const transactionData = amountMonthData.find(tr => tr.month === item.month);
          return {
            ...item,
            amount: transactionData ? transactionData.amount : 0,
          };
        });
        setDataBalanceChart(finalBalanceData);

        const incomeOutcomeData = getIncomeOutcomeTransactions(data, account as string);
        const lastTwelveMonthIncomeOutcome = getLastTwelveMonthIncomeOutcome();
        const finalIncomeOutcomeData = lastTwelveMonthIncomeOutcome.map(item => {
          const transactionData = incomeOutcomeData.find(tr => tr.month === item.month);
          return {
            ...item,
            income: transactionData ? transactionData.income : 0,
            outcome: transactionData ? transactionData.outcome : 0,
          };
        });
        setDataIncomeOutcomeChart(finalIncomeOutcomeData);
      } else if (data.error) {
        toast.error(data.error);
      }
    }
  }, [account, balance, data, data?.payload, dispatch, isSuccess]);

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
            Balance History
          </Typography>
          <Typography fontSize={'2rem'} paddingTop={'2rem'}>
            № {account}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} textAlign={'right'}>
          <BlueButton text='← Back to account' onClick={() => router.back()} />
          <Typography fontSize={'1.25rem'} fontWeight={'bold'} paddingTop={'2rem'}>
            Balance <span style={{ paddingLeft: '1rem' }}>{getNiceBalance(balance)}</span>
          </Typography>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2} display={'flex'}>
            <Grid size={12} display={'flex'} height={400}>
              <TransactionsChart chartData={dataBalanceChart} showHistoryBnt={false} />
            </Grid>
            <Grid size={12} height={400}>
              <IncomeOutcomeChart chartData={dataIncomeOutcomeChart} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <TransactionsTable rows={dataWithId} text={'Transactions history'} isPagination={true} />
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
