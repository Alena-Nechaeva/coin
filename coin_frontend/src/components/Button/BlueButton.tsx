import { Button } from '@mui/material';

export default function BlueButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <Button
      variant='contained'
      onClick={onClick}
      sx={{
        backgroundColor: 'primary.main',
        color: 'common.white',
        padding: '1rem 1.5rem',
        lineHeight: '100%',
        textTransform: 'none',
        fontSize: '1rem',
        fontFamily: 'Ubuntu',
      }}
    >
      {text}
    </Button>
  );
}
