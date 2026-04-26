import { API_BASE_URL, getAuthHeader } from './authApi';

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || fallbackMessage);
  }

  return data;
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

export async function getMySkills() {
  const response = await fetch(`${API_BASE_URL}/skills/my`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  return parseResponse(response, 'Failed to load my skills');
}

export async function addSkill(skillId) {
  const response = await fetch(`${API_BASE_URL}/skills/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ skill_id: skillId }),
  });

  return parseResponse(response, 'Failed to add skill');
}

export async function removeSkill(skillId) {
  const response = await fetch(`${API_BASE_URL}/skills/remove`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ skill_id: skillId }),
  });

  return parseResponse(response, 'Failed to remove skill');
}
