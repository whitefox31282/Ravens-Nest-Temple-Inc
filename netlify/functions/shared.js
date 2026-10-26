const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const DATA_DIR = path.resolve(__dirname, '../../data');
const QUEUE_PATH = path.join(DATA_DIR, 'queue.json');

function ensureQueue() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(QUEUE_PATH)) {
    fs.writeFileSync(
      QUEUE_PATH,
      JSON.stringify(
        {
          submissions: [],
          blacklist: [],
          stats: { pending: 0, approved: 0, rejected: 0, revoked: 0, banned: 0 },
          moderationLog: [],
        },
        null,
        2,
      ),
    );
  }
}

function readQueue() {
  ensureQueue();
  const raw = fs.readFileSync(QUEUE_PATH, 'utf8');

  try {
    return JSON.parse(raw);
  } catch (error) {
    return {
      submissions: [],
      blacklist: [],
      stats: { pending: 0, approved: 0, rejected: 0, revoked: 0, banned: 0 },
      moderationLog: [],
    };
  }
}

function writeQueue(queue) {
  ensureQueue();
  queue.stats = {
    pending: queue.submissions.filter((item) => item.status === 'pending').length,
    approved: queue.submissions.filter((item) => item.status === 'approved').length,
    rejected: queue.submissions.filter((item) => item.status === 'rejected').length,
    revoked: queue.submissions.filter((item) => item.status === 'revoked').length,
    banned: queue.blacklist.length,
  };
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
  return queue;
}

function decodeText(value) {
  if (typeof value === 'string') return value;
  return value && value.toString ? value.toString() : '';
}

function parseMultipart(rawBody, contentType) {
  const boundary = (contentType || '').split('boundary=')[1];
  if (!boundary) return { fields: {}, files: [] };

  const payload = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody || '', 'utf8');
  const rawParts = payload.toString('utf8').split(`--${boundary}`);
  const fields = {};
  const files = [];

  rawParts.forEach((part) => {
    if (!part || part.trim() === '--' || part.trim() === '') return;

    const section = part.trim();
    if (section === '--') return;

    const headersEnd = section.indexOf('\r\n\r\n');
    if (headersEnd === -1) return;

    const headers = section.slice(0, headersEnd);
    const body = section.slice(headersEnd + 4).replace(/\r\n$/, '');

    const dispositionMatch = headers.match(/name="([^"]+)"/);
    const filenameMatch = headers.match(/filename="([^"]*)"/);
    const fieldName = dispositionMatch ? dispositionMatch[1] : null;

    if (!fieldName) return;

    if (filenameMatch) {
      files.push({
        field: fieldName,
        filename: filenameMatch[1],
        contentType: (headers.match(/Content-Type:\s*([^\r\n]+)/i) || [])[1] || 'application/octet-stream',
        data: body,
      });
    } else {
      fields[fieldName] = decodeText(body.replace(/\r\n$/, ''));
    }
  });

  return { fields, files };
}

function parseIncomingBody(event) {
  const headers = event.headers || {};
  const contentType = headers['content-type'] || headers['Content-Type'] || '';
  const rawBody = event.body || '';

  if (!rawBody) {
    return { fields: {}, files: [] };
  }

  if (contentType.includes('multipart/form-data')) {
    const isBase64 = event.isBase64Encoded;
    return parseMultipart(isBase64 ? Buffer.from(rawBody, 'base64') : rawBody, contentType);
  }

  if (contentType.includes('application/json')) {
    try {
      return { fields: JSON.parse(rawBody), files: [] };
    } catch (error) {
      return { fields: {}, files: [] };
    }
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    return { fields: querystring.parse(rawBody), files: [] };
  }

  try {
    return { fields: JSON.parse(rawBody), files: [] };
  } catch (error) {
    return { fields: querystring.parse(rawBody), files: [] };
  }
}

function normalizeSubmission(input) {
  const timestamp = new Date().toISOString();
  const resourceType = input.resource_type || input.type || 'general';
  const identifier = input.submitter_email || input.submitter_phone || input.submitter_name || 'anonymous';
  const privateBusiness = input.private_business === true || input.private_business === 'true' || input.private_business === '1';
  const consentVerified = input.consent_verified === true || input.consent_verified === 'true' || input.consent_verified === '1';

  return {
    id: input.id || `sub_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    timestamp,
    status: 'pending',
    resource_type: resourceType,
    private_business: privateBusiness,
    consent_verified: consentVerified,
    public_render: !(privateBusiness && !consentVerified),
    submitter: {
      name: input.submitter_name || '',
      email: input.submitter_email || '',
      phone: input.submitter_phone || '',
      identifier,
    },
    notes: input.notes || '',
    fields: input.fields || {},
    photos: input.photos || [],
    essays: input.essays || {},
    admin_note: '',
  };
}

module.exports = {
  ensureQueue,
  readQueue,
  writeQueue,
  parseIncomingBody,
  normalizeSubmission,
};
