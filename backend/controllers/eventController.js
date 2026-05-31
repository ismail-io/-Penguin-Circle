import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
  try {
    const { apartmentId } = req.query;
    const filter = apartmentId ? { apartmentId } : {};

    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, capacity, category } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      capacity,
      category,
      createdBy: req.user.id,
      apartmentId: req.user.apartmentId,
    });

    const populatedEvent = await event.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedEvent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    let event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check authorization
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    event = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check authorization
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already joined this event' });
    }

    event.attendees.push(req.user.id);
    await event.save();

    const updatedEvent = await event.populate('attendees', 'name email');

    res.status(200).json({
      success: true,
      data: updatedEvent,
      message: 'Successfully joined event',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const leaveEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== req.user.id
    );
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Successfully left event',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
