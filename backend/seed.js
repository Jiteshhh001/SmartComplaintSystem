// Seed script - Populate database with realistic demo data
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Complaint = require('./models/Complaint');

const users = [
  {
    name: 'Rahul Kumar',
    email: 'rahul@gmail.com',
    password: 'password123',
  },
  {
    name: 'Admin User',
    email: 'admin@smartcomplaint.com',
    password: 'admin123',
  },
];

const complaints = [
  // 1. Water Supply — pre-analyzed: High
  {
    name: 'Rahul Kumar',
    email: 'rahul@gmail.com',
    title: 'Water Leakage Issue',
    description: 'Water pipeline damaged near market area. Continuous water leakage has been observed for the past 3 days causing waterlogging and inconvenience to pedestrians and shopkeepers.',
    category: 'Water Supply',
    location: 'Ghaziabad',
    status: 'Pending',
    aiAnalysis: {
      priority: 'High',
      department: 'Water Supply & Sewage Department',
      summary: 'Damaged water pipeline near market area causing continuous leakage and waterlogging for 3 days.',
      response: 'Dear Rahul Kumar,\n\nThank you for reporting the water leakage issue near the market area. This has been classified as HIGH priority due to the ongoing waterlogging and public inconvenience.\n\nThe Water Supply & Sewage Department has been notified for urgent repair.\n\nExpected Response Time: 24-48 hours\n\nRegards,\nSmartComplaint AI System',
      source: 'local-fallback',
    },
  },
  // 2. Electricity — no pre-analysis
  {
    name: 'Priya Sharma',
    email: 'priya@gmail.com',
    title: 'Street Light Not Working',
    description: 'Multiple street lights on MG Road near the bus stand have been non-functional for over a week. This is creating inconvenience for commuters during evening hours.',
    category: 'Electricity',
    location: 'Noida',
    status: 'In Progress',
  },
  // 3. Sanitation — pre-analyzed: Medium
  {
    name: 'Amit Verma',
    email: 'amit@gmail.com',
    title: 'Garbage Collection Delayed',
    description: 'The community garbage collection point near Block C has not been cleared for 5 days. Foul smell is becoming a concern for residents in the area.',
    category: 'Sanitation',
    location: 'Delhi',
    status: 'Pending',
    aiAnalysis: {
      priority: 'Medium',
      department: 'Sanitation & Waste Management Department',
      summary: 'Garbage collection delayed by 5 days at Block C community point, causing foul smell.',
      response: 'Dear Amit Verma,\n\nThank you for reporting the garbage collection delay. This has been classified as MEDIUM priority.\n\nThe Sanitation Department will schedule a cleanup within 3-5 business days.\n\nRegards,\nSmartComplaint AI System',
      source: 'local-fallback',
    },
  },
  // 4. Roads — pre-analyzed: Critical (accidents reported)
  {
    name: 'Sneha Gupta',
    email: 'sneha@gmail.com',
    title: 'Dangerous Pothole Causing Accidents',
    description: 'A large pothole has formed on the main highway near the toll plaza. Two accidents have already occurred this week. One person was hospitalized with serious injuries. This is life-threatening and needs immediate repair.',
    category: 'Roads',
    location: 'Ghaziabad',
    status: 'Pending',
    aiAnalysis: {
      priority: 'Critical',
      department: 'Public Works Department (PWD)',
      summary: 'Life-threatening pothole on highway near toll plaza — 2 accidents, 1 hospitalization this week.',
      response: 'Dear Sneha Gupta,\n\nThis has been flagged as CRITICAL priority due to the life-threatening nature of the situation and reported injuries. The Public Works Department has been alerted for emergency repair.\n\nExpected Response Time: 2-4 hours\n\nRegards,\nSmartComplaint AI System',
      source: 'local-fallback',
    },
  },
  // 5. Public Safety — no pre-analysis
  {
    name: 'Vikram Singh',
    email: 'vikram@gmail.com',
    title: 'Unauthorized Construction',
    description: 'An unauthorized multi-story building is being constructed near the residential area without proper permits. This violates building codes and poses risks to neighboring houses.',
    category: 'Public Safety',
    location: 'Lucknow',
    status: 'In Progress',
  },
  // 6. Water Supply — no pre-analysis
  {
    name: 'Anita Joshi',
    email: 'anita@gmail.com',
    title: 'Irregular Water Supply',
    description: 'Water supply has been extremely irregular in our colony for the past two weeks. We receive water only for 30 minutes in the morning which is insufficient for daily needs.',
    category: 'Water Supply',
    location: 'Delhi',
    status: 'Pending',
  },
  // 7. Electricity — pre-analyzed: High
  {
    name: 'Rajesh Patel',
    email: 'rajesh@gmail.com',
    title: 'Complete Power Outage in Industrial Area',
    description: 'Complete power outage in the industrial area since yesterday evening. Factories are unable to operate and significant financial losses are being incurred.',
    category: 'Electricity',
    location: 'Noida',
    status: 'Pending',
    aiAnalysis: {
      priority: 'High',
      department: 'Electricity Board / Power Department',
      summary: 'Complete power outage in industrial area since yesterday, causing factory shutdowns and financial losses.',
      response: 'Dear Rajesh Patel,\n\nWe understand the urgency of the power outage in the industrial area. This has been classified as HIGH priority and the Electricity Board has been notified for restoration.\n\nExpected Response Time: 24-48 hours\n\nRegards,\nSmartComplaint AI System',
      source: 'local-fallback',
    },
  },
  // 8. Roads — pre-analyzed: Low
  {
    name: 'Meera Reddy',
    email: 'meera@gmail.com',
    title: 'Broken Footpath Tiles',
    description: 'The footpath tiles near City Mall have been broken and uneven for months. It would be nice to get them repaired for a better walking experience.',
    category: 'Roads',
    location: 'Ghaziabad',
    status: 'Resolved',
    aiAnalysis: {
      priority: 'Low',
      department: 'Public Works Department (PWD)',
      summary: 'Cosmetic footpath tile damage near City Mall, minor inconvenience for pedestrians.',
      response: 'Dear Meera Reddy,\n\nThank you for your suggestion regarding the footpath tiles near City Mall. This has been classified as LOW priority as it is a cosmetic improvement.\n\nExpected Response Time: 7-10 business days\n\nRegards,\nSmartComplaint AI System',
      source: 'local-fallback',
    },
  },
  // 9. Sanitation — no pre-analysis
  {
    name: 'Suresh Yadav',
    email: 'suresh@gmail.com',
    title: 'Mosquito Breeding in Stagnant Water',
    description: 'A large pool of stagnant water has formed near the park area due to blocked drainage. This has led to mosquito breeding and residents are concerned about potential dengue cases.',
    category: 'Sanitation',
    location: 'Lucknow',
    status: 'In Progress',
  },
  // 10. Other — pre-analyzed: Medium
  {
    name: 'Kavita Nair',
    email: 'kavita@gmail.com',
    title: 'Noise Pollution from Construction Site',
    description: 'Excessive noise from a nearby construction site during night hours is causing disturbance to the entire residential area. Construction activity continues past 10 PM violating municipal guidelines.',
    category: 'Other',
    location: 'Delhi',
    status: 'Pending',
    aiAnalysis: {
      priority: 'Medium',
      department: 'General Administration Department',
      summary: 'Night-time construction noise violating municipal guidelines, disturbing residential area.',
      response: 'Dear Kavita Nair,\n\nThank you for reporting the noise pollution issue. This has been classified as MEDIUM priority. The General Administration Department will investigate the violation of municipal guidelines.\n\nExpected Response Time: 3-5 business days\n\nRegards,\nSmartComplaint AI System',
      source: 'local-fallback',
    },
  },
  // 11. Public Safety — no pre-analysis
  {
    name: 'Deepak Mishra',
    email: 'deepak@gmail.com',
    title: 'Fire Hydrant Non-Functional',
    description: 'The fire hydrant near the commercial complex on Station Road is completely non-functional. Given the density of shops and offices in the area, this is a safety concern.',
    category: 'Public Safety',
    location: 'Noida',
    status: 'Pending',
  },
  // 12. Electricity — no pre-analysis
  {
    name: 'Pooja Chauhan',
    email: 'pooja@gmail.com',
    title: 'Transformer Sparking',
    description: 'The electrical transformer near Sector 15 has been sparking intermittently. Residents fear it could cause a fire or electrocution. This is an emergency that requires immediate attention.',
    category: 'Electricity',
    location: 'Ghaziabad',
    status: 'Pending',
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create users (passwords will be hashed by the pre-save hook)
    const createdUsers = await User.create(users);
    console.log(`👤 Created ${createdUsers.length} users`);

    // Create complaints
    const createdComplaints = await Complaint.create(complaints);
    console.log(`📋 Created ${createdComplaints.length} complaints`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📧 Demo Login Credentials:');
    console.log('   Email: rahul@gmail.com | Password: password123');
    console.log('   Email: admin@smartcomplaint.com | Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
