'use client';

import { useAddAccountMutation, useGetAccountsQuery } from '@/api/api';
import React, { useEffect, useState } from 'react';
import { TPayload } from '@/api/api.types';
import toast from 'react-hot-toast';
import { Box, Container, Grid, Stack } from '@mui/system';
import { generateRandomString, getNiceBalance } from '@/utils/utils';
import {
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  Skeleton,
  Tooltip,
  IconButton,
} from '@mui/material';
import BlueButton from '@/components/Button/BlueButton';
import { useRouter } from 'next/navigation';
import { DndContext, closestCenter, DragEndEvent, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import Copy from '@/components/icons/Copy';

const Draggable = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

const Droppable = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} style={{ marginBottom: '1rem' }}>
      {children}
    </div>
  );
};

export default function AccountsPage() {
  const [sortedData, setSortedData] = useState<TPayload[]>([]);
  const [sortValue, setSortValue] = useState('');
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const { data, isSuccess, isFetching, isError } = useGetAccountsQuery(undefined, { refetchOnMountOrArgChange: true });

  const handleSortingChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSortValue(value as string);

    let sortedArray = [...sortedData];

    if (value === 'account') {
      sortedArray = sortedArray.sort((a, b) => {
        return BigInt(b.account) > BigInt(a.account) ? 1 : -1;
      });
    }

    if (value === 'balance') {
      sortedArray = sortedArray.sort((a, b) => b.balance - a.balance);
    }

    if (value === 'transaction') {
      sortedArray = sortedArray.sort((a, b) => {
        const transactionADate = a.transactions[0]?.date ? new Date(a.transactions[0].date).getTime() : 0;
        const transactionBDate = b.transactions[0]?.date ? new Date(b.transactions[0].date).getTime() : 0;

        return transactionBDate - transactionADate;
      });
    }
    setSortedData(sortedArray);
  };
  const handleOpenTransaction = (account: string) => {
    router.push('/accounts/' + account);
  };

  const [addAccount] = useAddAccountMutation();
  const handleAddAccount = async () => {
    try {
      const response = await addAccount().unwrap();
      if (response.payload) {
        toast.success('Account added successfully');
      } else if (response.error !== '') {
        toast.error(response.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = sortedData.findIndex(item => item.account === active.id);
      const overIndex = sortedData.findIndex(item => item.account === over.id);

      const updatedData = [...sortedData];
      const [movedItem] = updatedData.splice(activeIndex, 1);
      updatedData.splice(overIndex, 0, movedItem);

      setSortedData(updatedData);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (data.payload) {
        setSortedData(data.payload);
      } else if (data.error) {
        toast.error(data.error);
      }
    }
  }, [data?.error, data?.payload, isSuccess, router]);

  if (isFetching) {
    return (
      <Container maxWidth='xl'>
        <Stack spacing={4} paddingTop={'3rem'}>
          <Stack spacing={4} direction='row'>
            <Skeleton variant='rounded' width={'50%'} height={100} />
            <Skeleton variant='rounded' width={'50%'} height={100} />
          </Stack>
          <Stack spacing={2} direction='row'>
            <Skeleton variant='rounded' width={'50%'} height={200} />
            <Skeleton variant='rounded' width={'50%'} height={200} />
            <Skeleton variant='rounded' width={'50%'} height={200} />
          </Stack>
          <Stack spacing={2} direction='row'>
            <Skeleton variant='rounded' width={'50%'} height={200} />
            <Skeleton variant='rounded' width={'50%'} height={200} />
            <Skeleton variant='rounded' width={'50%'} height={200} />
          </Stack>
          <Stack spacing={2} direction='row'>
            <Skeleton variant='rounded' width={'50%'} height={200} />
            <Skeleton variant='rounded' width={'50%'} height={200} />
            <Skeleton variant='rounded' width={'50%'} height={200} />
          </Stack>
        </Stack>
      </Container>
    );
  }

  if (isError) toast.error('An error occurred while loading the data');

  return (
    <Container maxWidth='xl'>
      <Grid container spacing={2} paddingX={'1.563rem'} paddingTop={'3rem'} marginBottom={'3.125rem'} alignItems={'center'}>
        <Grid size={{ xs: 12, md: 6 }} display={'flex'} alignItems={'center'} flexDirection={'row'}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Typography marginRight={'2rem'} fontSize={'2rem'} fontWeight={'bold'}>
                Your accounts
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ minWidth: '18.75rem' }}>
                <FormControl fullWidth>
                  <InputLabel id='sort-label'>Sort by</InputLabel>
                  <Select labelId='sort-label' value={sortValue} label='Sort by' onChange={handleSortingChange}>
                    <MenuItem value='account'>By number</MenuItem>
                    <MenuItem value='balance'>By balance</MenuItem>
                    <MenuItem value='transaction'>By last transaction</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} textAlign={'right'}>
          <BlueButton text='+ Create new account' onClick={handleAddAccount} />
        </Grid>
      </Grid>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
        <Grid container spacing={2} paddingX={'1.563rem'}>
          {sortedData.map((item: TPayload) => {
            const date = item.transactions.length !== 0 ? new Date(item.transactions[0].date) : null;
            return (
              <Grid key={generateRandomString()} size={{ xs: 12, md: 6, lg: 4 }}>
                <Droppable id={item.account}>
                  <Draggable id={item.account}>
                    <Paper elevation={8} sx={{ padding: '1.5rem', borderRadius: '10px' }}>
                      <Typography
                        fontFamily={'Roboto'}
                        fontSize={'1.125rem'}
                        fontWeight={500}
                        marginBottom={'0.5rem'}
                        display={'flex'}
                        alignItems={'center'}
                      >
                        <span>{item.account}</span>
                        <Tooltip title='Copy to clipboard' arrow>
                          <IconButton
                            size='small'
                            onClick={() => {
                              navigator.clipboard.writeText(item.account);
                              toast.success('Copied to clipboard!');
                            }}
                            sx={{ marginLeft: '0.5rem' }}
                          >
                            <Copy />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <Typography marginBottom={'2rem'} fontFamily={'Ubuntu'} fontSize={'1rem'}>
                        {getNiceBalance(item.balance)}
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <Typography fontSize={'1rem'} fontWeight={'600'}>
                            Last Transaction
                          </Typography>
                          <Typography>
                            {date
                              ? `${date.getUTCDate()} ${date.toLocaleString('en-US', { month: 'long' })} of ${date.getUTCFullYear()}`
                              : 'No transactions'}
                          </Typography>
                        </Grid>
                        <Grid size={6} textAlign={'right'}>
                          <BlueButton text='Open' onClick={() => handleOpenTransaction(item.account)} />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Draggable>
                </Droppable>
              </Grid>
            );
          })}
        </Grid>
      </DndContext>
    </Container>
  );
}
