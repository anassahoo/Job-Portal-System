export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const AUTH_STORAGE_KEY = 'jb_auth_session';

function decodeJwt(token) {
	try {
		const payloadBase64 = token.split('.')[1];
		if (!payloadBase64) return null;

		const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((ch) => `%${`00${ch.charCodeAt(0).toString(16)}`.slice(-2)}`)
				.join('')
		);

		return JSON.parse(jsonPayload);
	} catch {
		return null;
	}
}

async function request(path, payload) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(data.error || data.message || 'Authentication request failed');
	}

	return data;
}

export async function signup({ email, password, role }) {
	return request('/auth/signup', { email, password, role });
}

export async function login({ email, password }) {
	const data = await request('/auth/login', { email, password });
	const token = data.token;
	const decoded = decodeJwt(token) || {};

	const user = {
		id: decoded.id,
		role: decoded.role || 'student',
		email,
		fname: email?.split('@')?.[0] || 'User',
		lname: '',
	};

	const session = { token, user };
	localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

	return {
		...data,
		user,
	};
}

export function getStoredSession() {
	try {
		const raw = localStorage.getItem(AUTH_STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

export function clearStoredSession() {
	localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthToken() {
	const session = getStoredSession();
	return session?.token || null;
}

export function getAuthHeader() {
	const token = getAuthToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export function updateStoredSessionUser(userPatch) {
	const session = getStoredSession();
	if (!session?.user) return;

	const nextSession = {
		...session,
		user: {
			...session.user,
			...userPatch,
		},
	};

	localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
}
