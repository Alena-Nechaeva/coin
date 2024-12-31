import { Button, Paper, Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import { BarChart } from '@mui/x-charts/BarChart';
import { getNiceBalance } from '@/utils/utils';
import { useSelector } from 'react-redux';
import { currentAccountSelect } from '@/components/componentsStore';
import { useRouter } from 'next/navigation';

export default function TransactionsChart({
  chartData,
  showHistoryBnt,
}: {
  chartData: { month: string; amount: number }[];
  showHistoryBnt: boolean;
}) {
  const account = useSelector(currentAccountSelect);
  const router = useRouter();
  const theme = useTheme();

  return (
    <Paper
      elevation={6}
      sx={{
        padding: '1.563rem 2.125rem',
        borderRadius: '50px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography color={'main.dark'} fontSize={'1.25rem'} fontWeight={700}>
          Balance dynamic
        </Typography>
        <Button
          variant='outlined'
          onClick={() => router.push(`/accounts/${account}/history`)}
          sx={{
            display: showHistoryBnt ? 'block' : 'none',
            padding: '1rem 1.5rem',
            lineHeight: '100%',
            textTransform: 'none',
            fontSize: '1rem',
            fontFamily: 'Ubuntu',
          }}
        >
          Check balance history →
        </Button>
      </Box>
      <Box display='flex' height={'100%'}>
        <BarChart
          xAxis={[
            {
              data: chartData.map(item => item.month),
              scaleType: 'band',
            },
          ]}
          yAxis={[
            {
              valueFormatter: value => {
                return getNiceBalance(value);
              },
            },
          ]}
          series={[
            {
              data: chartData.map(item => item.amount),
              label: 'Balance',
              valueFormatter: value => {
                return getNiceBalance(value ? value : 0);
              },
              color: theme.palette.primary.main,
            },
          ]}
          slotProps={{ legend: { hidden: true } }}
          margin={{ right: 80, left: 10, bottom: 20 }}
          rightAxis={{}}
          leftAxis={null}
        />
      </Box>
    </Paper>
  );
}
