const BASE_URL = 'http://localhost:8000/api/v1/leaves';

function getHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const leaveApi = {
  async getRequests(params?: { employee_id?: string; status?: string; leave_type?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.employee_id) searchParams.append('employee_id', params.employee_id);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.leave_type) searchParams.append('leave_type', params.leave_type);
    
    const url = `${BASE_URL}/requests?${searchParams.toString()}`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Failed to fetch requests');
    }
    return res.json();
  },

  async apply(payload: {
    employee_id: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    is_half_day?: boolean;
    half_day_position?: string | null;
  }) {
    const res = await fetch(`${BASE_URL}/apply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to apply leave');
    }
    return res.json();
  },

  async approve(id: number | string) {
    const res = await fetch(`${BASE_URL}/${id}/approve`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to approve request');
    }
    return res.json();
  },

  async reject(id: number | string) {
    const res = await fetch(`${BASE_URL}/${id}/reject`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to reject request');
    }
    return res.json();
  },

  async cancel(id: number | string) {
    const res = await fetch(`${BASE_URL}/${id}/cancel`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to cancel request');
    }
    return res.json();
  },

  async getBalances(employeeId: string) {
    const res = await fetch(`${BASE_URL}/balances/${employeeId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Failed to fetch balances');
    }
    return res.json();
  },

  async getCalendar() {
    const res = await fetch(`${BASE_URL}/calendar`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Failed to fetch calendar');
    }
    return res.json();
  }
};
