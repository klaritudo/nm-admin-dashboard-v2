import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Settings } from '@mui/icons-material';

const LineSettingsTab = ({ selectedAgent }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Settings />
        <Typography variant="h6">라인설정</Typography>
      </Box>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          라인설정 기능이 구현될 예정입니다.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LineSettingsTab; 