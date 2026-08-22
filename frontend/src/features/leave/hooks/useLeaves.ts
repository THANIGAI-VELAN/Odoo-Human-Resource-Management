import { useState, useCallback } from 'react';
import { leaveApi } from '../services/leaveApi';

export function useLeaves() {
  const [requests, setRequests] = useState<any[]>([]);
  const [balances, setBalances] = useState<any>(null);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async (params?: { employee_id?: string; status?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveApi.getRequests(params);
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBalances = useCallback(async (employeeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveApi.getBalances(employeeId);
      setBalances(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leave balances');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaveApi.getCalendar();
      setCalendarEvents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch calendar');
    } finally {
      setLoading(false);
    }
  }, []);

  const applyLeave = useCallback(async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const newReq = await leaveApi.apply(payload);
      setRequests((prev) => [newReq, ...prev]);
      if (payload.employee_id) {
        // Refresh balance after applying
        await fetchBalances(payload.employee_id);
      }
      return newReq;
    } catch (err: any) {
      setError(err.message || 'Failed to submit leave request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBalances]);

  const approveLeave = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedReq = await leaveApi.approve(id);
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? updatedReq : req))
      );
      // Refresh balances
      if (updatedReq.employee_id) {
        await fetchBalances(updatedReq.employee_id);
      }
      return updatedReq;
    } catch (err: any) {
      setError(err.message || 'Failed to approve request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBalances]);

  const rejectLeave = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedReq = await leaveApi.reject(id);
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? updatedReq : req))
      );
      return updatedReq;
    } catch (err: any) {
      setError(err.message || 'Failed to reject request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelLeave = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedReq = await leaveApi.cancel(id);
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? updatedReq : req))
      );
      if (updatedReq.employee_id) {
        await fetchBalances(updatedReq.employee_id);
      }
      return updatedReq;
    } catch (err: any) {
      setError(err.message || 'Failed to cancel request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBalances]);

  return {
    requests,
    balances,
    calendarEvents,
    loading,
    error,
    fetchRequests,
    fetchBalances,
    fetchCalendar,
    applyLeave,
    approveLeave,
    rejectLeave,
    cancelLeave
  };
}
