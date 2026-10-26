const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../../data');
const QUEUE_PATH = path.join(DATA_DIR, 'queue.json');

function ensureQueue() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(QUEUE_PATH)) {
    fs.writeFileSync(QUEUE_PATH, JSON.stringify({
      submissions: [],
      blacklist: [],
      stats: { pending: 0, approved: 0, rejected: 0, revoked: 0, banned: 0 },
      moderationLog: []
    }, null, 2));
  }
}

function readQueue() {
  ensureQueue();
  try {
    return JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  } catch (error) {
    return { submissions: [], blacklist: [], stats: { pending: 0, approved: 0, rejected: 0, revoked: 0, banned: 0 }, moderationLog: [] };
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

exports.handler = async () => {
  const queue = readQueue();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      stats: queue.stats,
      blacklistCount: queue.blacklist.length,
      submissions: queue.submissions,
    }),
  };
};
