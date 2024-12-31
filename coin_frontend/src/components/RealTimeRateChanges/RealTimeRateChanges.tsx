import { Box, Container, useTheme } from '@mui/system';
import { List, ListItem, Paper, Skeleton, Typography } from '@mui/material';
import { useGetCurrentCurrencyRateQuery } from '@/api/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TCurrentCurrencyRate } from '@/api/api.types';
import { generateRandomString } from '@/utils/utils';
import TriangleGreen from '@/components/icons/TriangleGreen';
import TriangleRed from '@/components/icons/TriangleRed';
import React from 'react';

export default function RealTimeRateChanges({ rateData }: { rateData?: TCurrentCurrencyRate }) {
  const emptyRate: TCurrentCurrencyRate = rateData
    ? rateData
    : {
        type: '',
        from: '',
        to: '',
        rate: null,
        change: null,
      };
  const [rates, setRates] = useState<TCurrentCurrencyRate[]>([emptyRate]);
  const [counter, setCounter] = useState<number>(0);
  const theme = useTheme();
  const { data, isSuccess, isError, isFetching } = useGetCurrentCurrencyRateQuery();
  useEffect(() => {
    if (isSuccess && data.error) {
      toast.error(data.error);
    }
  }, [data?.error, isSuccess]);

  useEffect(() => {
    if (isSuccess && data.payload) {
      if (data.payload.type === 'EXCHANGE_RATE_CHANGE') {
        setRates(prevRates => {
          const updatedRates = [...prevRates];
          const index = counter % 23;

          if (index < updatedRates.length) {
            updatedRates[index] = data.payload;
          } else {
            updatedRates.push(data.payload);
          }

          return updatedRates;
        });

        setCounter(prevCounter => (prevCounter + 1) % 23);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  if (isFetching) {
    return (
      <Container maxWidth='xl'>
        <Skeleton variant='rounded' height={400} />
      </Container>
    );
  }

  if (isError) toast.error('An error has occurred while loading currency rates data');

  return rates[0].rate !== null ? (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'grey.100',
        padding: '1.563rem 2.125rem',
        borderRadius: '50px',
        width: '100%',
        height: '100%',
      }}
    >
      <Box>
        <Typography color={'main.dark'} fontSize={'1.25rem'} fontWeight={700}>
          Real-time exchange rate changes
        </Typography>
      </Box>
      <Box
        sx={{
          maxHeight: '54rem',
          overflowY: 'auto',
        }}
      >
        <List>
          {rates.map(item => {
            return (
              <ListItem
                key={generateRandomString()}
                sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
              >
                <div style={{ lineHeight: '100%', paddingRight: '0.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
                  {item.from}/{item.to}
                </div>
                <div
                  style={{
                    flexGrow: 1,
                    borderBottom: '1px dashed',
                    borderColor: item.change === 1 ? theme.palette.success.main : theme.palette.secondary.main,
                  }}
                ></div>
                <div style={{ lineHeight: '100%', paddingLeft: '0.5rem', fontSize: '1.25rem' }}>
                  <span>{item.rate}</span>{' '}
                  <span style={{ display: 'inline-flex', alignItems: 'end' }}>
                    {item.change === 1 ? <TriangleGreen /> : <TriangleRed />}
                  </span>
                </div>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Paper>
  ) : (
    <Skeleton variant='rounded' height={940} aria-label='loading' />
  );
}
