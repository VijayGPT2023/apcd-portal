/* eslint-disable no-undef, no-console */
/**
 * k6 Load Test Script for APCD Portal
 *
 * Usage:
 *   k6 run scripts/load-test.js
 *   k6 run --env API_URL=https://apcd-api-production-415f.up.railway.app scripts/load-test.js
 *
 * Install k6:
 *   - Windows: choco install k6
 *   - Linux: sudo apt install k6
 *   - macOS: brew install k6
 */

import { check, sleep, group } from 'k6';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');
const dashboardDuration = new Trend('dashboard_duration');

const API_URL = __ENV.API_URL || 'http://localhost:4000';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 users
    { duration: '1m', target: 50 }, // Ramp up to 50 users
    { duration: '2m', target: 50 }, // Hold at 50 users
    { duration: '30s', target: 100 }, // Spike to 100 users
    { duration: '1m', target: 100 }, // Hold at 100 users
    { duration: '30s', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests under 3s
    http_req_failed: ['rate<0.05'], // Less than 5% failure rate
    errors: ['rate<0.1'], // Less than 10% error rate
  },
};

const TEST_USERS = [
  { email: 'oem@testcompany.com', password: 'Oem@APCD2025!' },
  { email: 'officer@npcindia.gov.in', password: 'Officer@APCD2025!' },
  { email: 'admin@npcindia.gov.in', password: 'Admin@APCD2025!' },
];

export default function () {
  const user = TEST_USERS[Math.floor(Math.random() * TEST_USERS.length)];

  group('Health Check', () => {
    const res = http.get(`${API_URL}/api/health`);
    check(res, { 'health check OK': (r) => r.status === 200 });
    errorRate.add(res.status !== 200);
  });

  group('Login Flow', () => {
    const start = Date.now();
    const res = http.post(
      `${API_URL}/api/auth/login`,
      JSON.stringify({ email: user.email, password: user.password }),
      { headers: { 'Content-Type': 'application/json' } },
    );
    loginDuration.add(Date.now() - start);

    const success = check(res, {
      'login status 200': (r) => r.status === 200,
      'login has token': (r) => {
        try {
          return JSON.parse(r.body).data.accessToken !== undefined;
        } catch {
          return false;
        }
      },
    });
    errorRate.add(!success);

    if (res.status === 200) {
      const token = JSON.parse(res.body).data.accessToken;
      const authHeaders = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      group('Dashboard', () => {
        const start = Date.now();
        const role = JSON.parse(res.body).data.user.role.toLowerCase();
        const dashRes = http.get(
          `${API_URL}/api/dashboard/${role === 'super_admin' ? 'admin' : role}`,
          authHeaders,
        );
        dashboardDuration.add(Date.now() - start);
        check(dashRes, { 'dashboard OK': (r) => r.status === 200 });
        errorRate.add(dashRes.status !== 200);
      });

      group('APCD Types (cached)', () => {
        const apcdRes = http.get(`${API_URL}/api/apcd-types`, authHeaders);
        check(apcdRes, { 'apcd types OK': (r) => r.status === 200 });
      });

      group('Notifications', () => {
        const notifRes = http.get(`${API_URL}/api/notifications?limit=10`, authHeaders);
        check(notifRes, { 'notifications OK': (r) => r.status === 200 });
      });
    }
  });

  sleep(1 + Math.random() * 2); // 1-3 second think time
}

export function handleSummary(data) {
  const summary = {
    totalRequests: data.metrics.http_reqs.values.count,
    avgResponseTime: Math.round(data.metrics.http_req_duration.values.avg),
    p95ResponseTime: Math.round(data.metrics.http_req_duration.values['p(95)']),
    p99ResponseTime: Math.round(data.metrics.http_req_duration.values['p(99)']),
    failureRate: (data.metrics.http_req_failed.values.rate * 100).toFixed(2) + '%',
    avgLoginTime: Math.round(loginDuration.values ? loginDuration.values.avg : 0),
    avgDashboardTime: Math.round(dashboardDuration.values ? dashboardDuration.values.avg : 0),
  };

  console.log('\n=== APCD Portal Load Test Summary ===');
  console.log(`Total Requests: ${summary.totalRequests}`);
  console.log(`Avg Response Time: ${summary.avgResponseTime}ms`);
  console.log(`P95 Response Time: ${summary.p95ResponseTime}ms`);
  console.log(`P99 Response Time: ${summary.p99ResponseTime}ms`);
  console.log(`Failure Rate: ${summary.failureRate}`);

  return {};
}
