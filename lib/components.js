import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

export const VisualizeButton = styled(LoadingButton)({
    color: '#cfc4ff',
    backgroundColor: 'var(--primary-text-accent)',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#472cac',
    },
    '&:disabled' : {
      color: 'lightgrey'
    }
})

export const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: 'var(--primary-text-accent)',
    },
    '& .MuiFormLabel-root': {
      fontSize: '14px',
      color: "#bdbdbd",
    },
    '& .MuiInputLabel-shrink': {
      color: '#bdbdbd',
      fontSize: '16px',
    },
  
    '& .MuiInputBase-input': {
      color: 'var(--primary-text-color)',
      fontSize: '14px',
      padding: '1rem'
    },
    '& .MuiOutlinedInput-root': {
      marginBottom: '1.25rem',
      '& fieldset': {
        border: '2px solid #d8d8d8',
        transition: 'border-color 0.5s ease',
      },
      '&:hover fieldset': {
        borderColor: '#b1b1b1',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--primary-text-accent)',
      },
    },
});