import { List, ListItem, Paper, Skeleton, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { formatCurrencyNumbers } from '@/utils/utils';
import { useGetUserCurrenciesQuery } from '@/api/api';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function UserCurrency() {
  const { data, isSuccess, isError, isFetching } = useGetUserCurrenciesQuery();
  useEffect(() => {
    if (isSuccess && data.error) {
      toast.error(data.error);
    }
  }, [data?.error, isSuccess]);

  if (isFetching) {
    return (
      <Container maxWidth='xl'>
        <Skeleton variant='rounded' height={630} />
      </Container>
    );
  }

  if (isError) toast.error('An error occurred while loading the data');

  return (
    <Paper elevation={6} sx={{ padding: '1.563rem 2.125rem', borderRadius: '50px', width: '100%', maxHeight: '40rem' }}>
      <Box>
        <Typography color={'main.dark'} fontSize={'1.25rem'} fontWeight={700}>
          Your currencies
        </Typography>
      </Box>
      {isSuccess ? (
        <Box sx={{ maxHeight: '35rem', overflowY: 'auto' }}>
          <List>
            {Object.values(data.payload).map(item => (
              <ListItem key={item.code} sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ lineHeight: '100%', paddingRight: '0.5rem', fontSize: '1.25rem', fontWeight: 600 }}>{item.code}</div>
                <div style={{ flexGrow: 1, borderBottom: '1px dashed' }}></div>
                <div style={{ lineHeight: '100%', paddingLeft: '0.5rem', fontSize: '1.25rem' }}>{formatCurrencyNumbers(item.amount)}</div>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Box sx={{ maxHeight: '35rem' }} />
      )}
    </Paper>
  );
}
