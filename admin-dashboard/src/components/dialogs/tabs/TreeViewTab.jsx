import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import {
  ExpandMore,
  ChevronRight,
  Person,
  AccountTree,
  TrendingUp,
  AttachMoney,
  Group
} from '@mui/icons-material';
import useDynamicTypes from '../../../hooks/useDynamicTypes';

const TreeViewTab = ({ selectedAgent, formatCurrency }) => {
  const { getTypeInfo } = useDynamicTypes();
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(['root']);

  // 샘플 트리 데이터 생성
  const generateTreeData = () => {
    const createNode = (id, name, level, parentId = null, depth = 0) => {
      const typeInfo = getTypeInfo(level);
      const hasChildren = depth < 3 && Math.random() > 0.3;
      
      const node = {
        id,
        name,
        level,
        parentId,
        depth,
        typeInfo,
        stats: {
          totalMembers: Math.floor(Math.random() * 100) + 1,
          activeMembers: Math.floor(Math.random() * 80) + 1,
          totalDeposit: Math.floor(Math.random() * 10000000),
          totalWithdraw: Math.floor(Math.random() * 8000000),
          profit: Math.floor(Math.random() * 2000000) - 1000000,
          commission: Math.floor(Math.random() * 500000)
        },
        children: []
      };

      if (hasChildren) {
        const childCount = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < childCount; i++) {
          const childLevel = Math.min(level + 1, 7); // 최대 레벨 7
          const child = createNode(
            `${id}-${i}`,
            `${name}_${i + 1}`,
            childLevel,
            id,
            depth + 1
          );
          node.children.push(child);
        }
      }

      return node;
    };

    // 루트 노드부터 시작
    const rootLevel = selectedAgent?.level || 1;
    return createNode('root', selectedAgent?.username || 'root', rootLevel);
  };

  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    setTreeData(generateTreeData());
  }, [selectedAgent, getTypeInfo]);

  const handleNodeToggle = (event, nodeIds) => {
    setExpandedNodes(nodeIds);
  };

  const handleNodeSelect = (event, nodeId) => {
    const findNode = (node, id) => {
      if (node.id === id) return node;
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
      return null;
    };

    if (treeData && nodeId) {
      const selectedId = Array.isArray(nodeId) ? nodeId[0] : nodeId;
      const node = findNode(treeData, selectedId);
      setSelectedNode(node);
    }
  };

  const renderTreeNode = (node) => {
    const typeInfo = node.typeInfo || { name: '일반', color: '#666', bgColor: '#f5f5f5' };
    
    return (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
              {node.name.charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {node.name}
            </Typography>
            <Chip
              label={typeInfo.name}
              size="small"
              sx={{
                backgroundColor: typeInfo.bgColor,
                color: typeInfo.color,
                fontSize: '0.7rem',
                height: 20,
                mr: 1
              }}
            />
            <Typography variant="caption" color="text.secondary">
              ({node.stats.totalMembers}명)
            </Typography>
          </Box>
        }
      >
        {node.children.map(child => renderTreeNode(child))}
      </TreeItem>
    );
  };

  const renderNodeDetails = (node) => {
    if (!node) return null;

    const typeInfo = node.typeInfo || { name: '일반', color: '#666', bgColor: '#f5f5f5' };

    return (
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
              {node.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">{node.name}</Typography>
              <Chip
                label={typeInfo.name}
                size="small"
                sx={{
                  backgroundColor: typeInfo.bgColor,
                  color: typeInfo.color,
                  fontSize: '0.8rem'
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Group fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="총 회원수"
                    secondary={`${node.stats.totalMembers}명`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="활성 회원수"
                    secondary={`${node.stats.activeMembers}명`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccountTree fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="하위 조직"
                    secondary={`${node.children.length}개`}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUp fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="총 입금액"
                    secondary={formatCurrency ? `${formatCurrency(node.stats.totalDeposit)}원` : `${node.stats.totalDeposit}원`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUp fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="총 출금액"
                    secondary={formatCurrency ? `${formatCurrency(node.stats.totalWithdraw)}원` : `${node.stats.totalWithdraw}원`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AttachMoney fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="수익"
                    secondary={
                      <Typography
                        variant="body2"
                        color={node.stats.profit >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency ? `${formatCurrency(Math.abs(node.stats.profit))}원` : `${Math.abs(node.stats.profit)}원`}
                        {node.stats.profit >= 0 ? ' 수익' : ' 손실'}
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              커미션: {formatCurrency ? `${formatCurrency(node.stats.commission)}원` : `${node.stats.commission}원`}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (!treeData) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>트리 데이터를 로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>조직 구조</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: 600, overflow: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom>
              조직 트리
            </Typography>
            <SimpleTreeView
              slots={{
                collapseIcon: ExpandMore,
                expandIcon: ChevronRight,
              }}
              expandedItems={expandedNodes}
              selectedItems={selectedNode?.id || ''}
              onExpandedItemsChange={handleNodeToggle}
              onSelectedItemsChange={handleNodeSelect}
              sx={{
                flexGrow: 1,
                maxWidth: '100%',
                overflowY: 'auto',
              }}
            >
              {renderTreeNode(treeData)}
            </SimpleTreeView>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: 600, overflow: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom>
              선택된 에이전트 정보
            </Typography>
            {selectedNode ? (
              renderNodeDetails(selectedNode)
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '80%',
                color: 'text.secondary'
              }}>
                <Typography>
                  트리에서 에이전트를 선택하세요
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TreeViewTab; 