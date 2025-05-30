/**
 * 게임사별 정산 데이터
 */

// 게임사 옵션
export const gameProviderOptions = [
  { value: 'pragmatic', label: 'Pragmatic Play' },
  { value: 'evolution', label: 'Evolution Gaming' },
  { value: 'netent', label: 'NetEnt' },
  { value: 'microgaming', label: 'Microgaming' },
  { value: 'playtech', label: 'Playtech' },
  { value: 'bigtime', label: 'Big Time Gaming' },
  { value: 'nolimit', label: 'Nolimit City' },
  { value: 'redtiger', label: 'Red Tiger Gaming' },
  { value: 'yggdrasil', label: 'Yggdrasil Gaming' },
  { value: 'hacksaw', label: 'Hacksaw Gaming' },
  { value: 'push', label: 'Push Gaming' },
  { value: 'thunderkick', label: 'Thunderkick' },
  { value: 'relax', label: 'Relax Gaming' },
  { value: 'kalamba', label: 'Kalamba Games' },
  { value: 'isoftbet', label: 'iSoftBet' },
  { value: 'blueprint', label: 'Blueprint Gaming' },
  { value: 'elk', label: 'ELK Studios' },
  { value: 'quickspin', label: 'Quickspin' },
  { value: 'playngo', label: 'Play\'n GO' },
  { value: 'betsoft', label: 'BetSoft Gaming' },
  { value: 'endorphina', label: 'Endorphina' },
  { value: 'pgsoft', label: 'PG Soft' },
  { value: 'pocket', label: 'Pocket Games Soft' },
  { value: 'onetouch', label: 'OneTouch' },
  { value: 'spadegaming', label: 'Spade Gaming' },
  { value: 'skywind', label: 'Skywind Group' },
  { value: 'cq9', label: 'CQ9 Gaming' },
  { value: 'joker', label: 'Joker Gaming' },
  { value: 'habanero', label: 'Habanero Systems' },
  { value: 'booongo', label: 'Booongo Gaming' },
  { value: 'evoplay', label: 'Evoplay Entertainment' },
  { value: 'spinomenal', label: 'Spinomenal' }
];

// 게임사별 정산 컬럼 정의
export const thirdPartySettlementColumns = [
  {
    id: 'index',
    label: 'No.',
    width: 80,
    align: 'center',
    type: 'number',
    sx: { textAlign: 'center !important' }
  },
  {
    id: 'gameProvider',
    label: '게임사',
    width: 200,
    align: 'center',
    type: 'text',
    sx: { textAlign: 'center !important' }
  },
  {
    id: 'betting',
    label: '베팅',
    width: 150,
    align: 'center',
    type: 'currency',
    sx: { textAlign: 'center !important' }
  },
  {
    id: 'winning',
    label: '당첨',
    width: 150,
    align: 'center',
    type: 'currency',
    sx: { textAlign: 'center !important' }
  },
  {
    id: 'bettingProfit',
    label: '베팅수익',
    width: 150,
    align: 'center',
    type: 'currency',
    sx: { textAlign: 'center !important' }
  }
];

// 게임사별 정산 데이터 생성 함수
export const generateThirdPartySettlementData = (types = null, typeHierarchy = null) => {
  return gameProviderOptions.map((provider, index) => {
    const betting = Math.floor(Math.random() * 10000000) + 1000000; // 100만 ~ 1100만
    const winning = Math.floor(betting * (0.85 + Math.random() * 0.1)); // 베팅의 85-95%
    const bettingProfit = betting - winning;

    return {
      id: index + 1,
      index: index + 1,
      gameProvider: provider.label,
      betting: betting,
      winning: winning,
      bettingProfit: bettingProfit,
      date: new Date().toISOString().split('T')[0] // 오늘 날짜
    };
  });
}; 