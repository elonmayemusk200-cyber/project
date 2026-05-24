const { pool } = require('../config/database');

const ticketStatusOptions = ['open', 'in_review', 'closed'];
const ticketPriorityOptions = ['low', 'normal', 'high', 'urgent'];

const normalizeStatus = (status) => (ticketStatusOptions.includes(status) ? status : 'open');
const normalizePriority = (priority) => (ticketPriorityOptions.includes(priority) ? priority : 'normal');

const emitTicketUpdate = (ticketId, payload) => {
  if (global.supportIO) {
    global.supportIO.to(`support-ticket-${ticketId}`).emit('support:ticket_updated', payload);
  }
};

const emitMessageReceived = (ticketId, payload) => {
  if (global.supportIO) {
    global.supportIO.to(`support-ticket-${ticketId}`).emit('support:message_received', payload);
  }
};

const buildTicketQuery = (req) => {
  let where = 'WHERE 1=1';
  const params = [];

  const status = String(req.query.status || '').trim();
  const priority = String(req.query.priority || '').trim();
  const search = String(req.query.search || '').trim();
  const assigned = String(req.query.assigned || '').trim();

  if (status && status !== 'all') {
    where += ' AND t.status = ?';
    params.push(normalizeStatus(status));
  }

  if (priority && priority !== 'all') {
    where += ' AND t.priority = ?';
    params.push(normalizePriority(priority));
  }

  if (assigned && assigned !== 'all') {
    if (assigned === 'assigned') {
      where += ' AND t.assigned_to IS NOT NULL';
    } else {
      where += ' AND t.assigned_to IS NULL';
    }
  }

  if (search) {
    where += ' AND ('
      + 't.customer_name LIKE ? '
      + 'OR t.customer_email LIKE ? '
      + 'OR t.subject LIKE ? '
      + 'OR t.message LIKE ? '
      + 'OR s.tracking_id LIKE ?'
      + ')';
    const query = `%${search}%`;
    params.push(query, query, query, query, query);
  }

  return { where, params };
};

exports.getSupportStats = async (req, res) => {
  try {
    const [totals] = await pool.execute(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open,
        SUM(CASE WHEN status = 'in_review' THEN 1 ELSE 0 END) AS in_review,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closed,
        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) AS urgent,
        SUM(CASE WHEN assigned_to IS NOT NULL THEN 1 ELSE 0 END) AS assigned
      FROM customer_support_tickets`
    );

    res.json({ success: true, stats: totals[0] });
  } catch (error) {
    console.error('Support stats error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getSupportAgents = async (req, res) => {
  try {
    const [agents] = await pool.execute(
      'SELECT id, name, email, role FROM admins ORDER BY name ASC'
    );
    res.json({ success: true, agents });
  } catch (error) {
    console.error('Support agents error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getSupportTickets = async (req, res) => {
  try {
    const { where, params } = buildTicketQuery(req);

    const [tickets] = await pool.execute(
      `SELECT
        t.*,
        s.tracking_id,
        s.status AS shipment_status,
        a.name AS assigned_to_name
      FROM customer_support_tickets t
      LEFT JOIN shipments s ON t.shipment_id = s.id
      LEFT JOIN admins a ON t.assigned_to = a.id
      ${where}
      ORDER BY t.updated_at DESC`,
      params
    );

    res.json({ success: true, tickets });
  } catch (error) {
    console.error('Support tickets error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getSupportTicket = async (req, res) => {
  try {
    const [tickets] = await pool.execute(
      `SELECT
        t.*,
        s.tracking_id,
        s.status AS shipment_status,
        s.current_location,
        s.admin_notes,
        a.name AS assigned_to_name
      FROM customer_support_tickets t
      LEFT JOIN shipments s ON t.shipment_id = s.id
      LEFT JOIN admins a ON t.assigned_to = a.id
      WHERE t.id = ?`,
      [req.params.id]
    );

    if (!tickets.length) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    const [messages] = await pool.execute(
      `SELECT
        m.id,
        m.ticket_id,
        m.sender_type,
        m.sender_id,
        m.message,
        m.created_at,
        m.is_read,
        COALESCE(a.name, c.name, 'Customer') AS sender_name
      FROM support_ticket_messages m
      LEFT JOIN admins a ON m.sender_type = 'agent' AND m.sender_id = a.id
      LEFT JOIN customers c ON m.sender_type = 'customer' AND m.sender_id = c.id
      WHERE m.ticket_id = ?
      ORDER BY m.created_at ASC`,
      [req.params.id]
    );

    res.json({ success: true, ticket: tickets[0], messages });
  } catch (error) {
    console.error('Support ticket detail error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getSupportTicketMessages = async (req, res) => {
  try {
    const [messages] = await pool.execute(
      `SELECT
        m.id,
        m.ticket_id,
        m.sender_type,
        m.sender_id,
        m.message,
        m.created_at,
        m.is_read,
        COALESCE(a.name, c.name, 'Customer') AS sender_name
      FROM support_ticket_messages m
      LEFT JOIN admins a ON m.sender_type = 'agent' AND m.sender_id = a.id
      LEFT JOIN customers c ON m.sender_type = 'customer' AND m.sender_id = c.id
      WHERE m.ticket_id = ?
      ORDER BY m.created_at ASC`,
      [req.params.id]
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Support ticket messages error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateSupportTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const normalizedStatus = normalizeStatus(status);

    await pool.execute(
      'UPDATE customer_support_tickets SET status = ?, updated_at = NOW() WHERE id = ?',
      [normalizedStatus, req.params.id]
    );

    const [ticketRows] = await pool.execute(
      `SELECT
        t.id,
        t.status,
        t.priority,
        t.assigned_to,
        a.name AS assigned_to_name
      FROM customer_support_tickets t
      LEFT JOIN admins a ON t.assigned_to = a.id
      WHERE t.id = ?`,
      [req.params.id]
    );

    emitTicketUpdate(Number(req.params.id), {
      ticketId: Number(req.params.id),
      ticket: ticketRows[0],
      event: 'status_updated'
    });

    res.json({ success: true, ticket: ticketRows[0] });
  } catch (error) {
    console.error('Update support ticket status error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.assignSupportTicket = async (req, res) => {
  try {
    const { agentId } = req.body;

    await pool.execute(
      'UPDATE customer_support_tickets SET assigned_to = ?, updated_at = NOW() WHERE id = ?',
      [agentId || null, req.params.id]
    );

    const [ticketRows] = await pool.execute(
      `SELECT t.id, t.status, t.priority, t.assigned_to, a.name AS assigned_to_name
       FROM customer_support_tickets t
       LEFT JOIN admins a ON t.assigned_to = a.id
       WHERE t.id = ?`,
      [req.params.id]
    );

    emitTicketUpdate(Number(req.params.id), {
      ticketId: Number(req.params.id),
      ticket: ticketRows[0],
      event: 'agent_assigned'
    });

    res.json({ success: true, ticket: ticketRows[0] });
  } catch (error) {
    console.error('Assign support ticket error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.replyToSupportTicket = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({ success: false, message: 'Reply message is required.' });
    }

    const [ticketRows] = await pool.execute(
      'SELECT id, status FROM customer_support_tickets WHERE id = ?',
      [req.params.id]
    );

    if (!ticketRows.length) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    const [insertResult] = await pool.execute(
      'INSERT INTO support_ticket_messages (ticket_id, sender_type, sender_id, message) VALUES (?, ?, ?, ?)',
      [req.params.id, 'agent', req.admin.id, String(message).trim()]
    );

    await pool.execute(
      'UPDATE customer_support_tickets SET status = ?, updated_at = NOW(), last_reply_at = NOW() WHERE id = ?',
      ['in_review', req.params.id]
    );

    const [messageRows] = await pool.execute(
      `SELECT
        m.id,
        m.ticket_id,
        m.sender_type,
        m.sender_id,
        m.message,
        m.created_at,
        m.is_read,
        a.name AS sender_name
      FROM support_ticket_messages m
      LEFT JOIN admins a ON m.sender_type = 'agent' AND m.sender_id = a.id
      WHERE m.id = ?`,
      [insertResult.insertId]
    );

    const payload = {
      ticketId: Number(req.params.id),
      message: messageRows[0],
      ticket: { id: Number(req.params.id), status: 'in_review' }
    };

    emitMessageReceived(Number(req.params.id), payload);
    emitTicketUpdate(Number(req.params.id), {
      ticketId: Number(req.params.id),
      ticket: { id: Number(req.params.id), status: 'in_review' },
      event: 'reply_sent'
    });

    res.json({ success: true, message: messageRows[0], ticket: payload.ticket });
  } catch (error) {
    console.error('Reply support ticket error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
