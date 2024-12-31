import { Box, Container } from '@mui/system';
import { Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Box
      component='main'
      sx={{
        height: '93vh',
        backgroundImage: 'url(/home_bg.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container maxWidth='xl'>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} height={'80vh'}>
          <Typography color={'common.white'} sx={{ fontSize: '4rem' }}>
            Welcome to the future of finance
          </Typography>
          <Typography color={'common.white'} sx={{ fontSize: '2rem' }} textAlign={'center'} lineHeight={'4rem'}>
            Our innovative project merges traditional banking with the world of cryptocurrencies, offering unique opportunities to manage
            your assets. We are creating the first bank that openly and freely allows users to exchange and manage cryptocurrencies
            alongside traditional currencies. Be part of a new stage in the evolution of finance with us
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
