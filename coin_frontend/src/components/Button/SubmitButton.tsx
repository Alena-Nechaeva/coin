import { LoadingButton } from '@mui/lab';
import Envelope from '@/components/icons/Envelope';

export default function SubmitButton({
  loadingBtnState,
  startIcon,
  text,
}: {
  loadingBtnState: boolean;
  startIcon?: boolean;
  text: string;
}) {
  return (
    <LoadingButton
      loading={loadingBtnState}
      variant='contained'
      type='submit'
      startIcon={startIcon ? <Envelope /> : null}
      sx={{
        padding: '1rem 1.5rem',
        lineHeight: '100%',
        textTransform: 'none',
        fontSize: '1rem',
        fontFamily: 'Ubuntu',
        height: '100%',
      }}
    >
      {text}
    </LoadingButton>
  );
}
