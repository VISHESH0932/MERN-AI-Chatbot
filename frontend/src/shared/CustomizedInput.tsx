import { TextField, Box, InputAdornment} from '@mui/material';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  name: string;
  type: string;
  label: string;
  value?: string;
  icon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomizedInput = (props: Props) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ 
        width: '100%',
        mb: 2,
        position: 'relative' 
      }}
    >
      <TextField 
        fullWidth
        margin='normal'
        variant="outlined"
        name={props.name} 
        label={props.label} 
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        autoComplete={props.type === 'password' ? 'current-password' : props.type === 'email' ? 'email' : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        InputLabelProps={{ 
          style: { 
            color: focused ? 'var(--accent-color)' : 'var(--text-muted)',
            fontWeight: focused ? 500 : 400,
          } 
        }}
        InputProps={{
          startAdornment: props.icon && (
            <InputAdornment position="start">
              {props.icon}
            </InputAdornment>
          ),
          style: { 
            borderRadius: 12,
            fontSize: 16,
            color: 'white',
            transition: 'all 0.3s ease',
          },
          sx: {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--accent-color)',
              borderWidth: '2px',
            },
          }
        }}
      />
    </Box>
  );
}

export default CustomizedInput;
