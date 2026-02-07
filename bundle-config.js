// Bundle pricing + savings (MSRP method = 2x current template prices)
// This file is optional; it documents the numbers used for website copy.

const templates = [
  { id: 1, name: 'Lead Generation Engine', price: 479 },
  { id: 2, name: 'Support Ticket System', price: 399 },
  { id: 3, name: 'Recruitment Automation', price: 459 },
  { id: 4, name: 'Cold Outreach', price: 299 },
  { id: 5, name: 'Webinar Automation', price: 249 },
  { id: 6, name: 'Customer Onboarding', price: 279 },
  { id: 7, name: 'Invoice Processor', price: 329 },
  { id: 8, name: 'Social Media Scheduler', price: 279 },
  { id: 9, name: 'Newsletter Automation', price: 249 },
  { id: 10, name: 'Meeting Notes', price: 249 },
  { id: 11, name: 'Competitor Tracker', price: 279 },
  { id: 12, name: 'Review Management', price: 279 },
  { id: 13, name: 'Subscription Manager', price: 349 },
  { id: 14, name: 'Lead Nurture Sequence', price: 399 },
  { id: 15, name: 'Appointment Scheduler', price: 199 },
  { id: 16, name: 'Employee Onboarding', price: 399 },
  { id: 17, name: 'Content Repurposer', price: 329 },
  { id: 18, name: 'Uptime Monitor', price: 199 }
];

const msrpMultiplier = 2;

const bundles = {
  starter: {
    slug: 'starter-bundle',
    price: 499,
    templateIds: [1, 2, 4, 6, 15, 18]
  },
  growth: {
    slug: 'growth-bundle',
    price: 799,
    templateIds: [1,2,3,4,5,6,7,8,9,10,14,17]
  },
  complete: {
    slug: 'complete-bundle',
    price: 1299,
    templateIds: templates.map(t => t.id)
  }
};

function sum(ids) {
  return ids
    .map(id => templates.find(t => t.id === id)?.price || 0)
    .reduce((a, b) => a + b, 0);
}

for (const [k, b] of Object.entries(bundles)) {
  const base = sum(b.templateIds);
  const msrp = base * msrpMultiplier;
  const save = msrp - b.price;
  const pct = Math.round((save / msrp) * 100);
  console.log(k, { base, msrp, price: b.price, save, pct });
}
