import Resource from '../models/Resource.js';

export const getResources = async (req, res) => {
  try {
    const { apartmentId, category, availability } = req.query;
    const filter = { apartmentId: req.user.apartmentId };

    if (category) filter.category = category;
    if (availability !== undefined) filter.availability = availability === 'true';

    const resources = await Resource.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createResource = async (req, res) => {
  try {
    const { name, description, category, quantity, condition } = req.body;

    const resource = await Resource.create({
      name,
      description,
      category,
      quantity,
      condition,
      owner: req.user.id,
      apartmentId: req.user.apartmentId,
    });

    const populatedResource = await resource.populate('owner', 'name email');

    res.status(201).json({
      success: true,
      data: populatedResource,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;

    let resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check authorization
    if (resource.owner.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to update this resource' });
    }

    resource = await Resource.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate('owner', 'name email');

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check authorization
    if (resource.owner.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await Resource.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
