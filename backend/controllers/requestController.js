import ResourceRequest from '../models/ResourceRequest.js';
import Resource from '../models/Resource.js';

export const getRequests = async (req, res) => {
  try {
    const { status } = req.query;

    // Admins see ALL requests; regular users see only their own
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
    const filter  = isAdmin ? {} : { requestedBy: req.user.id };

    if (status) filter.status = status;

    const requests = await ResourceRequest.find(filter)
      .populate('resourceId')
      .populate('requestedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ requestDate: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRequest = async (req, res) => {
  try {
    const { resourceId, requestMessage } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (!resource.availability) {
      return res.status(400).json({ message: 'Resource is not available' });
    }

    const request = await ResourceRequest.create({
      resourceId,
      requestedBy: req.user.id,
      requestMessage,
    });

    const populatedRequest = await request
      .populate('resourceId')
      .populate('requestedBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    let request = await ResourceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    request.status = 'approved';
    request.approvedBy = req.user.id;
    request.approvalDate = new Date();
    await request.save();

    const updatedRequest = await request
      .populate('resourceId')
      .populate('requestedBy', 'name email')
      .populate('approvedBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedRequest,
      message: 'Request approved',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    let request = await ResourceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    request.status = 'rejected';
    request.rejectionReason = rejectionReason;
    await request.save();

    const updatedRequest = await request
      .populate('resourceId')
      .populate('requestedBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedRequest,
      message: 'Request rejected',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
