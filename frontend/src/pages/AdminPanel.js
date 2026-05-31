import React, { useState, useEffect } from 'react';
import { usersAPI, resourcesAPI, requestsAPI, eventsAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { Users, Share2, Calendar, CheckCircle } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResources: 0,
    pendingRequests: 0,
    totalEvents: 0,
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [users, resources, requests, events] = await Promise.all([
        usersAPI.getAll(),
        resourcesAPI.getAll(),
        requestsAPI.getAll(),
        eventsAPI.getAll(),
      ]);

      const pending = requests.data.data.filter((req) => req.status === 'pending');

      setStats({
        totalUsers: users.data.count || 0,
        totalResources: resources.data.count || 0,
        pendingRequests: pending.length,
        totalEvents: events.data.count || 0,
      });

      setPendingRequests(pending);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await requestsAPI.approve(requestId);
      setPendingRequests(pendingRequests.filter((req) => req._id !== requestId));
      fetchAdminData();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await requestsAPI.reject(requestId, { rejectionReason: 'Rejected by admin' });
      setPendingRequests(pendingRequests.filter((req) => req._id !== requestId));
      fetchAdminData();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (loading) return <div className="admin-panel">Loading...</div>;

  // Only superadmin and admin can access this
  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return <div className="admin-panel">Access Denied</div>;
  }

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={32} />
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Share2 size={32} />
          </div>
          <div className="stat-content">
            <h3>Resources</h3>
            <p className="stat-number">{stats.totalResources}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={32} />
          </div>
          <div className="stat-content">
            <h3>Events</h3>
            <p className="stat-number">{stats.totalEvents}</p>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">
            <CheckCircle size={32} />
          </div>
          <div className="stat-content">
            <h3>Pending Requests</h3>
            <p className="stat-number">{stats.pendingRequests}</p>
          </div>
        </div>
      </div>

      <div className="admin-sections">
        <div className="section">
          <h2>Resource Requests Management</h2>
          {pendingRequests.length > 0 ? (
            <div className="requests-table">
              <table>
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Requested By</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((req) => (
                    <tr key={req._id}>
                      <td>{req.resourceId?.name}</td>
                      <td>{req.requestedBy?.name}</td>
                      <td>
                        <span className="badge pending">Pending</span>
                      </td>
                      <td>
                        <button
                          className="btn-small btn-approve"
                          onClick={() => handleApprove(req._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-small btn-reject"
                          onClick={() => handleReject(req._id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-state">No pending requests</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
