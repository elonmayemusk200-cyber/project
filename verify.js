#!/usr/bin/env node

/**
 * Midwest Shipment - System Verification Script
 * Checks all components are ready before development
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('\n🔍 Midwest Shipment - System Verification\n');

let allChecks = [];

// Check 1: Backend configuration
function checkBackendConfig() {
  return new Promise((resolve) => {
    const envPath = path.join(__dirname, 'backend', '.env');
    const exists = fs.existsSync(envPath);
    allChecks.push({
      name: 'Backend .env Configuration',
      status: exists ? '✅ PASS' : '❌ FAIL',
      message: exists ? 'Configuration file found' : 'backend/.env not found'
    });
    resolve();
  });
}

// Check 2: Frontend configuration
function checkFrontendConfig() {
  return new Promise((resolve) => {
    const nextConfigPath = path.join(__dirname, 'frontend', 'next.config.js');
    const exists = fs.existsSync(nextConfigPath);
    allChecks.push({
      name: 'Frontend Next.js Configuration',
      status: exists ? '✅ PASS' : '❌ FAIL',
      message: exists ? 'Next.js config found' : 'next.config.js not found'
    });
    resolve();
  });
}

// Check 3: Backend health check
function checkBackendHealth() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      allChecks.push({
        name: 'Backend API Health (port 5000)',
        status: '✅ RUNNING',
        message: `Backend API is responsive (${res.statusCode})`
      });
      resolve();
    });

    req.on('error', () => {
      allChecks.push({
        name: 'Backend API Health (port 5000)',
        status: '⏸️  NOT RUNNING',
        message: 'Backend is not currently running'
      });
      resolve();
    });

    req.on('timeout', () => {
      req.abort();
      allChecks.push({
        name: 'Backend API Health (port 5000)',
        status: '⏸️  NOT RUNNING',
        message: 'Backend connection timeout'
      });
      resolve();
    });

    req.end();
  });
}

// Check 4: Frontend health check
function checkFrontendHealth() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      allChecks.push({
        name: 'Frontend App (port 3000)',
        status: '✅ RUNNING',
        message: `Frontend is responsive (${res.statusCode})`
      });
      resolve();
    });

    req.on('error', () => {
      allChecks.push({
        name: 'Frontend App (port 3000)',
        status: '⏸️  NOT RUNNING',
        message: 'Frontend is not currently running'
      });
      resolve();
    });

    req.on('timeout', () => {
      req.abort();
      allChecks.push({
        name: 'Frontend App (port 3000)',
        status: '⏸️  NOT RUNNING',
        message: 'Frontend connection timeout'
      });
      resolve();
    });

    req.end();
  });
}

// Run all checks
async function runChecks() {
  await checkBackendConfig();
  await checkFrontendConfig();
  await checkBackendHealth();
  await checkFrontendHealth();

  // Print results
  console.log('┌─ System Status ─────────────────────────────┐');
  allChecks.forEach(check => {
    console.log(`│ ${check.status}`);
    console.log(`│ ${check.name}`);
    console.log(`│ → ${check.message}`);
    console.log('│');
  });
  console.log('└─────────────────────────────────────────────┘\n');

  // Summary
  const passing = allChecks.filter(c => c.status.includes('✅')).length;
  const total = allChecks.length;
  console.log(`Summary: ${passing}/${total} checks passed\n`);

  if (passing === total) {
    console.log('🎉 All systems operational!\n');
  } else {
    console.log('⚠️  Some systems need attention.\n');
  }
}

runChecks();
