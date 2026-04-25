import { API_BASE_URL, getAuthHeader } from './authApi';

const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

async function parseResponse(response, fallbackMessage) {
	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(data.error || data.message || fallbackMessage);
	}

	return data;
}

export function getProfileImageUrl(fileName) {
	if (!fileName) return '';
	return `${SERVER_BASE_URL}/uploads/images/${fileName}`;
}

export async function getMyProfile() {
	const response = await fetch(`${API_BASE_URL}/users/me`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			...getAuthHeader(),
		},
	});

	return parseResponse(response, 'Failed to load profile');
}

export async function updateMyProfile(payload) {
	const response = await fetch(`${API_BASE_URL}/users/me`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			...getAuthHeader(),
		},
		body: JSON.stringify(payload),
	});

	return parseResponse(response, 'Failed to update profile');
}

export async function updateMyAccount(payload) {
	let response;

	try {
		response = await fetch(`${API_BASE_URL}/users/me/account`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				...getAuthHeader(),
			},
			body: JSON.stringify(payload),
		});
	} catch {
		throw new Error('Cannot connect to server. Please make sure backend is running on port 5000.');
	}

	const raw = await response.text();
	let data = {};

	try {
		data = raw ? JSON.parse(raw) : {};
	} catch {
		data = { error: raw || '' };
	}

	if (!response.ok) {
		const serverMessage = data.error || data.message || '';

		if (response.status === 401) {
			if (/no token|token/i.test(serverMessage)) {
				throw new Error('Your session expired. Please sign in again.');
			}

			throw new Error('Current password is incorrect.');
		}

		if (response.status === 400) {
			if (/invalid token/i.test(serverMessage)) {
				throw new Error('Your session is invalid. Please sign in again.');
			}

			throw new Error(serverMessage || 'Please verify your account details and try again.');
		}

		if (response.status === 404) {
			throw new Error('Account update route not found. Please restart backend server.');
		}

		if (response.status >= 500) {
			throw new Error(serverMessage || 'Server error while updating account. Please try again.');
		}

		throw new Error(serverMessage || `Account update failed (${response.status}).`);
	}

	return data;
}

export async function uploadMyProfileImage(file) {
	const formData = new FormData();
	formData.append('image', file);

	const response = await fetch(`${API_BASE_URL}/users/upload`, {
		method: 'POST',
		headers: {
			...getAuthHeader(),
		},
		body: formData,
	});

	return parseResponse(response, 'Failed to upload profile image');
}
