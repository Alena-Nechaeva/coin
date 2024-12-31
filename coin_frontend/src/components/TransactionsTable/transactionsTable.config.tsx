import { GridCellParams, GridColDef } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { TTransactionId } from '@/api/api.types';
import { currentAccountSelect } from '@/components/componentsStore';
import { getNiceBalance } from '@/utils/utils';
import { Box } from '@mui/system';

const RenderAmount = (params: GridCellParams<TTransactionId>) => {
  const senderAccount = params.row.from;
  const currentAccount = useSelector(currentAccountSelect);

  return senderAccount === currentAccount ? (
    <Box color={'secondary.main'}>- {getNiceBalance(params.row.amount)}</Box>
  ) : (
    <Box color={'success.main'}>+ {getNiceBalance(params.row.amount)}</Box>
  );
};

export const columnsTransactions: GridColDef[] = [
  { field: 'from', headerName: 'Sender’s account', flex: 1, minWidth: 300 },
  { field: 'to', headerName: 'Recipient’s account', flex: 1, minWidth: 300 },
  { field: 'amount', headerName: 'Amount', flex: 1, minWidth: 150, renderCell: (params: GridCellParams) => <RenderAmount {...params} /> },
  {
    field: 'date',
    headerName: 'Date',
    flex: 1,
    minWidth: 150,
    valueGetter: (params: string) => new Date(params).toLocaleDateString('en-GB').replace(/\//g, '.'),
  },
];
