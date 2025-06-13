import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Typography } from '@mui/material';

/**
 * Quill 에디터 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.value - 에디터 내용
 * @param {Function} props.onChange - 내용 변경 콜백
 * @param {string} props.label - 에디터 레이블
 * @param {number} props.height - 에디터 높이 (px)
 * @param {boolean} props.required - 필수 필드 여부
 * @returns {JSX.Element}
 */
const QuillEditor = ({ 
  value, 
  onChange, 
  label = '내용', 
  height = 300,
  required = false,
  placeholder = '내용을 입력해주세요...'
}) => {
  // 로컬 상태로 값 관리
  const [editorValue, setEditorValue] = useState(value || '');
  
  // 외부 value 변경시 내부 상태 업데이트
  useEffect(() => {
    setEditorValue(value || '');
  }, [value]);
  
  // 에디터 내용 변경 핸들러
  const handleChange = (content) => {
    setEditorValue(content);
    
    // 부모 컴포넌트에 변경 알림
    if (onChange) {
      // 직접 content 전달 (MaintenancePage 등에서 사용)
      if (typeof onChange === 'function') {
        onChange(content);
      }
    }
  };
  
  // 에디터 모듈 설정
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };
  
  // 에디터 포맷 설정
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];
  
  return (
    <Box sx={{ mb: 2, mt: 2 }}>
      {label && (
        <Typography 
          variant="body1" 
          sx={{ mb: 1, fontWeight: required ? 'bold' : 'normal' }}
        >
          {label} {required && <Box component="span" sx={{ color: 'error.main' }}>*</Box>}
        </Typography>
      )}
      <Box
        sx={{
          '& .ql-container': {
            height: `${height - 42}px`, // 툴바 높이(42px) 고려
            fontSize: '16px'
          },
          '& .ql-editor': {
            minHeight: `${height - 42}px`,
            fontSize: '16px'
          },
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
          }
        }}
      >
        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </Box>
    </Box>
  );
};

export default QuillEditor; 