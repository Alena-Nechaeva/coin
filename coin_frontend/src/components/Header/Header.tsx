'use client';

import { Container, Grid } from '@mui/system';
import { Button, Paper, Typography } from '@mui/material';
import WhiteButton from '@/components/Button/WhiteButton';
import { usePathname, useRouter } from 'next/navigation';
import ButtonsMenu from '@/components/ButtonsMenu/ButtonsMenu';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const token = localStorage.getItem('accessToken');

  return (
    <Paper elevation={8} sx={{ backgroundColor: 'primary.main', borderRadius: '0' }}>
      <Container maxWidth='xl' sx={{ paddingY: '1.563rem' }}>
        <Grid container>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button onClick={() => router.push('/')}>
              <Typography sx={{ color: 'common.white', fontWeight: '300', fontSize: '3rem', paddingX: '1.563rem' }}>Coin .</Typography>
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} display={'flex'} alignItems={'center'} justifyContent='flex-end'>
            {pathname === '/login' ? (
              token ? (
                <ButtonsMenu />
              ) : (
                <></>
              )
            ) : token ? (
              <ButtonsMenu />
            ) : (
              <WhiteButton text='Log In' onClick={() => router.push('/login')} fullWidth={false} />
            )}
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
