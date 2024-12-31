import { Button } from '@mui/material';

export default function WhiteButton({
  text,
  onClick,
  backgroundColor,
  fullWidth,
}: {
  text: string;
  onClick: () => void;
  backgroundColor?: string;
  fullWidth: boolean;
}) {
  return (
    <Button
      fullWidth={fullWidth}
      onClick={onClick}
      sx={{
        backgroundColor: backgroundColor ? backgroundColor : 'common.white',
        color: 'primary.dark',
        padding: '1rem 1.5rem',
        lineHeight: '100%',
        textTransform: 'none',
        fontSize: '1rem',
        fontFamily: 'Ubuntu',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </Button>
  );
}
