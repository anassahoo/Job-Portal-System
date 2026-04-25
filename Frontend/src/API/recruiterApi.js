import { API_BASE_URL, getAuthHeader } from './authApi';

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || fallbackMessage);
  }

  return data;
}

export async function createCompany(payload) {
  const response = await fetch(`${API_BASE_URL}/companies/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response, 'Failed to create company');
}

export async function getCompanies() {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  return parseResponse(response, 'Failed to load companies');
}

export async function createJob(payload) {
  const response = await fetch(`${API_BASE_URL}/jobs/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response, 'Failed to create job');
}

export async function getJobs() {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  return parseResponse(response, 'Failed to load jobs');
}

export async function getRecruiterApplications() {
  const response = await fetch(`${API_BASE_URL}/applications/recruiter`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  return parseResponse(response, 'Failed to load applicants');
}
