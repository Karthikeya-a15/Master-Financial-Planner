import api from './axios';

// Dashboard data
export const getDashboardData = async () => {
  try {
    const response = await api.get('/networth/dashboard');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Cash Flows
export const getCashFlows = async () => {
  try {
    const response = await api.get('/networth/cashFlows');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const updateCashFlows = async (data) => {
  try {
    const response = await api.put('/networth/cashFlows', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Real Estate
export const getRealEstate = async () => {
  try {
    const response = await api.get('/networth/realEstate');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const updateRealEstate = async (data) => {
  try {
    const response = await api.put('/networth/realEstate', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Domestic Equity
export const getDomesticEquity = async () => {
  try {
    const response = await api.get('/networth/domesticEquity');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const updateDomesticEquity = async (data) => {
  try {
    const response = await api.put('/networth/domesticEquity', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Foreign Equity
export const getForeignEquity = async () => {
  try {
    const response = await api.get('/networth/foreignEquity');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const updateForeignEquity = async (data) => {
  try {
    const response = await api.put('/networth/foreignEquity', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Debt
export const getDebt = async () => {
  try {
    const response = await api.get('/networth/debt');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const updateDebt = async (data) => {
  try {
    const response = await api.put('/networth/debt', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Gold
export const getGold = async () => {
  try {
    const response = await api.get('/networth/gold');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const updateGold = async (data) => {
  try {
    const response = await api.put('/networth/gold', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Crypto
export const getCrypto = async () => {
  try {
    const response = await api.get('/networth/cryptoCurrency');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const updateCrypto = async (data) => {
  try {
    const response = await api.put('/networth/cryptoCurrency', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Miscellaneous
export const getMiscellaneous = async () => {
  try {
    const response = await api.get('/networth/miscellaneous');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const updateMiscellaneous = async (data) => {
  try {
    const response = await api.put('/networth/miscellaneous', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Liabilities
export const getLiabilities = async () => {
  try {
    const response = await api.get('/networth/liabilities');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const updateLiabilities = async (data) => {
  try {
    const response = await api.put('/networth/liabilities', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};