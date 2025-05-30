import { useMemo, useCallback } from 'react';
import useDynamicTypes from './useDynamicTypes';
import { apiOptions, bankList } from '../pages/agent-management/data/membersData';

/**
 * 페이지 데이터 로딩을 위한 범용 훅
 * 모든 관리 페이지의 데이터 로딩 패턴을 통합 지원
 */
export const usePageData = (config) => {
  const {
    pageType,
    dataGenerator,
    requiresMembersData = false,
    membersDataGenerator = null
  } = config;

  // 동적 유형 관리 훅 사용
  const {
    types,
    typeHierarchy,
    isLoading: typesLoading,
    error: typesError,
    isInitialized: typesInitialized,
    convertToHierarchicalData
  } = useDynamicTypes();

  // 공통 회원 데이터 생성 함수
  const generateMembersData = useCallback((dynamicTypes, dynamicTypeHierarchy) => {
    if (!dynamicTypes || Object.keys(dynamicTypes).length === 0) {
      return [];
    }

    const typeKeys = Object.keys(dynamicTypes);
    const membersData = [];

    // 각 유형별로 회원 데이터 생성
    typeKeys.forEach((typeKey, index) => {
      const type = dynamicTypes[typeKey];
      
      // 상위 유형들 계산
      const getParentTypes = (currentTypeKey) => {
        const parents = [];
        const findParents = (key, visited = new Set()) => {
          if (visited.has(key)) return;
          visited.add(key);
          
          Object.entries(dynamicTypeHierarchy).forEach(([parentKey, children]) => {
            if (children.includes(key) && !visited.has(parentKey)) {
              const parentType = dynamicTypes[parentKey];
              parents.unshift({ 
                label: parentType?.label || parentKey, 
                color: parentType?.color || 'default',
                backgroundColor: parentType?.backgroundColor,
                borderColor: parentType?.borderColor
              });
              findParents(parentKey, visited);
            }
          });
        };
        findParents(currentTypeKey);
        return parents;
      };

      const parentTypes = getParentTypes(typeKey);
      
      // 각 유형별로 2명의 회원 생성
      for (let i = 0; i < 2; i++) {
        const memberId = index * 10 + i + 1;
        membersData.push({
          id: memberId,
          userId: `${typeKey}_user${i + 1}\n${type.label}${i + 1}`,
          username: `${typeKey}_user${i + 1}`,
          nickname: `${type.label}${i + 1}`,
          type: { 
            label: type.label || typeKey, 
            color: type.color || 'default',
            backgroundColor: type.backgroundColor,
            borderColor: type.borderColor
          },
          parentTypes: parentTypes,
          balance: Math.floor(Math.random() * 5000000) + 1000000,
          gameMoney: Math.floor(Math.random() * 2000000) + 500000,
          rollingPercent: Math.round(Math.random() * 10) / 10,
          rollingAmount: Math.floor(Math.random() * 100000),
          api: apiOptions[Math.floor(Math.random() * apiOptions.length)].value,
          deposit: Math.floor(Math.random() * 3000000) + 1000000,
          withdrawal: Math.floor(Math.random() * 500000),
          connectionStatus: ['온라인', '오프라인', '정지'][Math.floor(Math.random() * 3)],
          lastGame: `2024-01-${String(20 + Math.floor(Math.random() * 10)).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          name: `${type.label}${i + 1}`,
          accountNumber: `${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900000) + 100000)}`,
          bank: bankList[Math.floor(Math.random() * bankList.length)],
          profitLoss: {
            slot: Math.floor(Math.random() * 1000000) - 500000,
            casino: Math.floor(Math.random() * 500000) - 250000,
            total: 0
          },
          connectionDate: `2024-01-${String(20 + Math.floor(Math.random() * 10)).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          registrationDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          description: `${type.label || typeKey} 계정입니다.`,
          child1: `${type.label?.charAt(0) || 'X'}${i + 1}`,
          child2: `${type.label?.charAt(0) || 'X'}${i + 2}`,
          child3: `${type.label?.charAt(0) || 'X'}${i + 3}`,
          child4: `${type.label?.charAt(0) || 'X'}${i + 4}`,
          child5: `${type.label?.charAt(0) || 'X'}${i + 5}`,
          child6: `${type.label?.charAt(0) || 'X'}${i + 6}`
        });
      }
    });

    // profitLoss.total 계산
    membersData.forEach(member => {
      member.profitLoss.total = member.profitLoss.slot + member.profitLoss.casino;
    });

    return membersData;
  }, []);

  // 회원 데이터 (2단계 구조에서 필요한 경우만 생성)
  const membersData = useMemo(() => {
    if (requiresMembersData && typesInitialized && Object.keys(types).length > 0) {
      // 커스텀 회원 데이터 생성기가 있으면 사용, 없으면 기본 생성기 사용
      const generator = membersDataGenerator || generateMembersData;
      return generator(types, typeHierarchy);
    }
    return [];
  }, [requiresMembersData, typesInitialized, types, typeHierarchy, membersDataGenerator, generateMembersData]);

  // 최종 테이블 데이터
  const data = useMemo(() => {
    if (!typesInitialized || Object.keys(types).length === 0) {
      return [];
    }

    if (requiresMembersData) {
      // 2단계 구조: 회원 데이터가 필요한 경우
      if (membersData.length > 0) {
        return dataGenerator(types, typeHierarchy, membersData);
      }
      return [];
    } else {
      // 1단계 구조: 직접 데이터 생성
      if (dataGenerator) {
        return dataGenerator(types, typeHierarchy);
      } else {
        // dataGenerator가 없으면 기본 회원 데이터 생성
        return generateMembersData(types, typeHierarchy);
      }
    }
  }, [typesInitialized, types, typeHierarchy, membersData, dataGenerator, requiresMembersData, generateMembersData]);

  return {
    // 데이터
    data,
    membersData,
    
    // 동적 유형 정보
    types,
    typeHierarchy,
    
    // 로딩 상태
    isLoading: typesLoading,
    error: typesError,
    isInitialized: typesInitialized,
    
    // 유틸리티
    convertToHierarchicalData
  };
};

export default usePageData; 