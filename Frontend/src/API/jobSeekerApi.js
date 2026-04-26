import { API_BASE_URL, getAuthHeader } from './authApi';

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || fallbackMessage);
  }

  return data;
}

export async function getJobsForJobSeeker() {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  return parseResponse(response, 'Failed to load jobs');
}

export async function getRecruitersForJobSeeker() {
  const response = await fetch(`${API_BASE_URL}/companies/recruiters`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  return parseResponse(response, 'Failed to load recruiters');
}

export async function getCandidatesForJobSeeker() {
  const response = await fetch(`${API_BASE_URL}/users/candidates`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  return parseResponse(response, 'Failed to load candidates');
}

export async function uploadResumeForJobSeeker(file, metadata = {}) {
  const formData = new FormData();
  formData.append('resume', file);
  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const response = await fetch(`${API_BASE_URL}/resume/upload`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });

  return parseResponse(response, 'Failed to upload resume');
}

export async function applyToJob(payload) {
  const response = await fetch(`${API_BASE_URL}/applications/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response, 'Failed to apply for job');
}

export async function getMyApplicationsForJobSeeker() {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  return parseResponse(response, 'Failed to load applications');
}
