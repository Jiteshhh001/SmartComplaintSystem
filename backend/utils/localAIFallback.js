// Local AI fallback - Deterministic keyword-based complaint analysis
// Uses a scoring system to produce diverse, realistic priority classifications

// Department mapping based on category
const DEPARTMENT_RULES = {
  'Water Supply': {
    department: 'Water Supply & Sewage Department',
    keywords: ['water', 'pipeline', 'leak', 'tap', 'supply', 'sewage', 'drain', 'flood'],
  },
  'Electricity': {
    department: 'Electricity Board / Power Department',
    keywords: ['electric', 'power', 'outage', 'wire', 'transformer', 'voltage', 'blackout', 'short circuit'],
  },
  'Sanitation': {
    department: 'Sanitation & Waste Management Department',
    keywords: ['garbage', 'waste', 'trash', 'cleaning', 'hygiene', 'dump', 'smell', 'pest'],
  },
  'Roads': {
    department: 'Public Works Department (PWD)',
    keywords: ['road', 'pothole', 'crack', 'bridge', 'footpath', 'traffic', 'signal', 'pavement'],
  },
  'Public Safety': {
    department: 'Public Safety & Law Enforcement',
    keywords: ['safety', 'theft', 'crime', 'danger', 'accident', 'fire', 'emergency', 'vandal'],
  },
  'Other': {
    department: 'General Administration Department',
    keywords: [],
  },
};

// Scoring-based priority: each keyword adds points, final score determines priority
const PRIORITY_SCORES = {
  // +5 points — life-threatening / emergency
  critical: ['life-threatening', 'electrocution', 'explosion', 'collapse', 'death', 'fatal'],
  // +3 points — urgent / dangerous
  high: ['emergency', 'fire', 'flood', 'danger', 'hazard', 'accident', 'sparking', 'outage'],
  // +2 points — notable severity
  elevated: ['urgent', 'broken', 'damaged', 'leaking', 'overflowing', 'non-functional', 'immediate', 'severe'],
  // +1 point — standard issue
  standard: ['issue', 'problem', 'complaint', 'repair', 'fix', 'concern', 'irregular', 'poor'],
  // -1 point — reduces urgency
  mitigating: ['minor', 'small', 'cosmetic', 'suggestion', 'request', 'improvement', 'months', 'tiles'],
};

/**
 * Analyze a complaint using local deterministic rules with scoring
 * @param {Object} complaint - { title, description, category, location, name }
 * @returns {Object} - { priority, department, summary, response }
 */
const analyzeComplaintLocally = (complaint) => {
  const { title, description, category, location } = complaint;
  const fullText = `${title} ${description}`.toLowerCase();

  // 1. Determine department from category
  const categoryRule = DEPARTMENT_RULES[category] || DEPARTMENT_RULES['Other'];
  const department = categoryRule.department;

  // 2. Calculate priority score
  let score = 0;
  PRIORITY_SCORES.critical.forEach((kw) => { if (fullText.includes(kw)) score += 5; });
  PRIORITY_SCORES.high.forEach((kw) => { if (fullText.includes(kw)) score += 3; });
  PRIORITY_SCORES.elevated.forEach((kw) => { if (fullText.includes(kw)) score += 2; });
  PRIORITY_SCORES.standard.forEach((kw) => { if (fullText.includes(kw)) score += 1; });
  PRIORITY_SCORES.mitigating.forEach((kw) => { if (fullText.includes(kw)) score -= 1; });

  // Category-based baseline adjustments
  if (category === 'Public Safety') score += 2;
  if (category === 'Other') score -= 1;

  // Map score to priority level
  let priority;
  if (score >= 8) priority = 'Critical';
  else if (score >= 5) priority = 'High';
  else if (score >= 2) priority = 'Medium';
  else priority = 'Low';

  // 3. Generate summary
  const summary =
    description.length > 120
      ? `${description.substring(0, 117)}...`
      : description;

  // 4. Generate auto-response based on priority
  const responseTime = {
    Critical: '2-4 hours',
    High: '24-48 hours',
    Medium: '3-5 business days',
    Low: '7-10 business days',
  };

  const response = `Dear ${complaint.name || 'Citizen'},\n\nThank you for reporting your concern regarding "${title}". Your complaint has been registered and classified under the ${category} category with ${priority} priority.\n\nIt has been forwarded to the ${department} for prompt attention. Our team will review this matter and take appropriate action.\n\nComplaint Location: ${location}\nExpected Response Time: ${responseTime[priority]}\n\nThank you for helping us improve our community.\n\nRegards,\nSmartComplaint AI System`;

  return {
    priority,
    department,
    summary,
    response,
    source: 'local-fallback',
  };
};

module.exports = { analyzeComplaintLocally };
