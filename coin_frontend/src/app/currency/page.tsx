'use client';

import { Container, Grid } from '@mui/system';
import { Typography } from '@mui/material';
import UserCurrency from '@/components/UserCurrency/UserCurrency';
import ExchangeCurrencyForm from '@/components/ExchangeCurrencyForm/ExchangeCurrencyForm';
import RealTimeRateChanges from '@/components/RealTimeRateChanges/RealTimeRateChanges';

export default function CurrencyPage() {
  return (
    <Container maxWidth='xl'>
      <Grid container spacing={6} paddingX={'1.563rem'} paddingTop={'3rem'} marginBottom={'3.125rem'} alignItems={'center'}>
        <Grid size={12}>
          <Typography marginRight={'2rem'} fontSize={'2rem'} fontWeight={'bold'}>
            Currency exchange
          </Typography>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Grid container spacing={6} flexDirection={'column'}>
                <Grid size={12}>
                  <UserCurrency />
                </Grid>
                <Grid size={12}>
                  <ExchangeCurrencyForm />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <RealTimeRateChanges />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
