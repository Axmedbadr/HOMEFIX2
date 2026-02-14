const API_BASE_URL =   'http://localhost:5000';

export const checkAuthStatus = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return { success: false };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, user: data.user };
    } else {
      return { success: false };
    }
  } catch (error) {
    return { success: false };
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Network error occurred' };
  }
};

export const logout = async () => {
  localStorage.removeItem('token');
  return { success: true };
};

export const getProfessionals = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/professionals`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching professionals:', error);
    return [];
  }
};

export const getProfessionalsBySkill = async (skill) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/professionals?skill=${skill}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching professionals:', error);
    return [];
  }
};

export const createProfessional = async (data) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_BASE_URL}/api/professionals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    return response.json();
  } catch (error) {
    console.error('Error creating professional:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

export const updateProfessional = async (id, data) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_BASE_URL}/api/professionals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    return response.json();
  } catch (error) {
    console.error('Error updating professional:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

export const deleteProfessional = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_BASE_URL}/api/professionals/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.json();
  } catch (error) {
    console.error('Error deleting professional:', error);
    return { success: false, message: 'Network error occurred' };
  }
};