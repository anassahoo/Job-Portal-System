import { API_BASE_URL, getAuthHeader } from './authApi';

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || fallbackMessage);
  }

  return data;
}

export async function createCompany(payload) {
  const formData = new FormData();
  formData.append('name', payload.name || '');
  formData.append('description', payload.description || '');
  if (payload.logo) {
    formData.append('logo', payload.logo);
  }

  const response = await fetch(`${API_BASE_URL}/companies/create`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
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

export async function getMyCompany() {
  const response = await fetch(`${API_BASE_URL}/companies/my`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  return parseResponse(response, 'Failed to load recruiter company');
}

export async function updateMyCompany(payload) {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append('name', payload.name || '');
  if (payload.description !== undefined) formData.append('description', payload.description || '');
  if (payload.logo) formData.append('logo', payload.logo);

  const response = await fetch(`${API_BASE_URL}/companies/my`, {
    method: 'PUT',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });

  return parseResponse(response, 'Failed to update company');
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

export async function updateJob(jobId, payload) {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response, 'Failed to update job');
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

export async function getMyJobs() {
  const response = await fetch(`${API_BASE_URL}/jobs/my`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  return parseResponse(response, 'Failed to load recruiter jobs');
}

export async function addJobSkill(payload) {
  const response = await fetch(`${API_BASE_URL}/jobs/add-skill`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response, 'Failed to add required skill to job');
}

export async function getAllSkills() {
  const response = await fetch(`${API_BASE_URL}/skills/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  return parseResponse(response, 'Failed to load skills');
}

export async function createSkill(payload) {
  const response = await fetch(`${API_BASE_URL}/skills/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response, 'Failed to create skill');
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

export async function updateRecruiterApplicationStatus(applicationId, status) {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  });

  return parseResponse(response, 'Failed to update applicant status');
}
