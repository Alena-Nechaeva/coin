import { Paper, Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import { BarChart } from '@mui/x-charts/BarChart';
import { getNiceBalance } from '@/utils/utils';

export default function IncomeOutcomeChart({ chartData }: { chartData: { month: string; income: number; outcome: number }[] }) {
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
          Incoming and outgoing transactions
        </Typography>
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
              data: chartData.map(item => item.income),
              stack: 'total',
              label: 'Income',
              valueFormatter: value => {
                return getNiceBalance(value ? value : 0);
              },
              color: theme.palette.success.main,
            },
            {
              data: chartData.map(item => item.outcome),
              stack: 'total',
              label: 'Outcome',
              valueFormatter: value => {
                return getNiceBalance(value ? value : 0);
              },
              color: theme.palette.secondary.main,
            },
          ]}
          slotProps={{ legend: { hidden: true } }}
          margin={{ right: 80, left: 10 }}
          rightAxis={{}}
          leftAxis={null}
        />
      </Box>
    </Paper>
  );
}
