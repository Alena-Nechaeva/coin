import WhiteButton from '@/components/Button/WhiteButton';
import { usePathname, useRouter } from 'next/navigation';
import { Grid } from '@mui/system';
import { checkToken } from '@/utils/utils';

export default function ButtonsMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    window.localStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <Grid container spacing={4} justifyContent={'space-between'}>
      <Grid size={3}>
        <WhiteButton
          text='ATMs'
          onClick={() => checkToken(router, '/atms')}
          backgroundColor={pathname === '/atms' ? 'info.main' : 'common.white'}
          fullWidth={true}
        />
      </Grid>
      <Grid size={3}>
        <WhiteButton
          text='Accounts'
          onClick={() => checkToken(router, '/accounts')}
          backgroundColor={pathname === '/accounts' ? 'info.main' : 'common.white'}
          fullWidth={true}
        />
      </Grid>
      <Grid size={3}>
        <WhiteButton
          text='Currency'
          onClick={() => checkToken(router, '/currency')}
          backgroundColor={pathname === '/currency' ? 'info.main' : 'common.white'}
          fullWidth={true}
        />
      </Grid>
      <Grid size={3}>
        <WhiteButton text='Log Out' onClick={handleLogout} fullWidth={true} />
      </Grid>
    </Grid>
  );
}
