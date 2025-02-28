import api from './axios';

// Returns & Assets Mix Assumptions
export const getAssumptions = async () => {
  try {
    const response = await api.get('/planner/assumptions');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const updateAssumptions = async (data) => {
  try {
    const response = await api.put('/planner/assumptions', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Financial Goals
export const getFinancialGoals = async () => {
  try {
    const response = await api.get('/planner/financialGoals');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const updateFinancialGoals = async (data) => {
  try {
    const response = await api.put('/planner/financialGoals', data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};