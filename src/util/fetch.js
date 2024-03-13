import fetch from "node-fetch";
import { errorMessage } from "../error-message";

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPost(url, options, body) {
	try {
		const response = await fetch(
			url,
			{
				method: "POST",
				...options,
			},
			body,
		);
		const data = await response.json();

		if (response.ok) {
			return data;
		}

		throw new Error(`[${response.status}-${data.code}] ${data.message} ${errorMessage}`);
	} catch (error) {
		throw error;
	}
}

export async function fetchWithRetry(url, options, tryCount = 0) {
	try {
		const response = await fetch(url, options);
		const data = await response.json();

		if (response.ok) {
			return data;
		}

		// handle time limit error
		if (response.status === 429 && tryCount < 5) {
			console.log(`retry fetch... (${tryCount + 1}/5)`);
			await sleep(1000 * 3);
			return fetchWithRetry(url, options, tryCount + 1);
		}

		throw new Error(`[${response.status}-${data.code}] ${data.message} ${errorMessage}`);
	} catch (error) {
		throw error;
	}
}
