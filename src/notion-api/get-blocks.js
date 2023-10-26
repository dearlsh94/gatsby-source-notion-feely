const fetch = require("node-fetch");
const { errorMessage } = require("../error-message");

let tryCount = 0;
async function fetchBlocks({ id, notionVersion, token, cursor }, reporter) {
	tryCount++;
	let url = `https://api.notion.com/v1/blocks/${id}/children`;

	if (cursor) {
		url += `?start_cursor=${cursor}`;
	}

	try {
		const result = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
				"Notion-Version": notionVersion,
				Authorization: `Bearer ${token}`,
			},
		}).then((res) => res.json());

		const { object, status, code, message } = result;
		if (object === "error") {
			// rate_limited
			if (status === 429) {
				const sleep = (ms) => {
					const wakeUpTime = Date.now() + ms;
					while (Date.now() < wakeUpTime) {}
				};

				while (tryCount <= 5) {
					reporter.warn(`[${status}] rate limited! retry after 15s (${tryCount}/5)`);
					sleep(1000 * 15);
					return await fetchBlocks({ id, notionVersion, token }, reporter);
				}
			}
			throw new Error(`[${status}-${code}] ${message} ${errorMessage}`);
		}

		return result;
	} catch (error) {
		reporter.error(error);
		return {
			results: [],
			has_children: false,
		};
	}
}

async function getBlocks({ id, token, notionVersion = "2022-06-28" }, reporter) {
	let hasMore = true;
	let blockContent = [];
	let startCursor = "";

	while (hasMore) {
		tryCount = 0;
		const result = await fetchBlocks(
			{
				id,
				notionVersion,
				token,
				cursor: startCursor,
			},
			reporter,
		);

		for (let childBlock of result.results) {
			if (childBlock.has_children) {
				tryCount = 0;
				childBlock.children = await getBlocks({ id: childBlock.id, notionVersion, token }, reporter);
			}
		}

		blockContent = blockContent.concat(result.results);
		startCursor = result.next_cursor;
		hasMore = result.has_more;
	}

	return blockContent;
}

exports.getBlocks = getBlocks;
