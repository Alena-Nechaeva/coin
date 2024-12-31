'use client';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { columnsTransactions } from '@/components/TransactionsTable/transactionsTable.config';
import { TTransactionId } from '@/api/api.types';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { currentAccountSelect } from '@/components/componentsStore';

export default function TransactionsTable({ rows, text, isPagination }: { rows: TTransactionId[]; text: string; isPagination: boolean }) {
  const account = useSelector(currentAccountSelect);
  const router = useRouter();

  return (
    <Box sx={{ backgroundColor: 'grey.100', borderRadius: '50px', paddingTop: '3.125rem' }}>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} sx={{ padding: '0 3.125rem' }}>
        <Typography color={'main.dark'} fontSize={'1.25rem'} fontWeight={700}>
          {text}
        </Typography>
        <Button
          variant='outlined'
          onClick={() => router.push(`/accounts/${account}/history`)}
          sx={{
            display: isPagination ? 'none' : 'block',
            padding: '1rem 1.5rem',
            lineHeight: '100%',
            textTransform: 'none',
            fontSize: '1rem',
            fontFamily: 'Ubuntu',
          }}
        >
          Check transactions history →
        </Button>
      </Box>
      <DataGrid
        disableColumnMenu
        disableColumnFilter={true}
        hideFooterPagination={!isPagination}
        hideFooter={!isPagination}
        initialState={{
          sorting: {
            sortModel: [{ field: 'date', sort: 'asc' }],
          },
          pagination: {
            paginationModel: { pageSize: 15, page: 0 },
          },
        }}
        pageSizeOptions={[5, 15, 25]}
        columns={columnsTransactions}
        rows={rows || []}
        disableColumnSelector
        disableDensitySelector
        scrollbarSize={0}
        isRowSelectable={() => false}
        rowSelection={false}
        keepNonExistentRowsSelected={false}
        slots={{ toolbar: GridToolbar }}
        sx={{
          border: 'none',
          padding: '3.125rem',
          '& .MuiDataGrid-columnHeaders': {
            borderRadius: '50px',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#116ACC',
            color: '#fff',
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
}
