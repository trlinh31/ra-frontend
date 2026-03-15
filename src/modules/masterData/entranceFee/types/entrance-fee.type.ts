export type EntranceFeeGroup = {
  id: string;
  code: string; // I, II, III...
  name: string;
};

export type EntranceFeeItem = {
  id: string;
  groupId: string;
  serviceName: string;
  adultNetRateVnd?: number;
  notes: string;
};
