import { blockToString } from "../block-to-string";

export const getTitleByNotionPage = (page) => {
	const titleProperty = Object.keys(page.properties).find((key) => page.properties[key].type == "title");

	return blockToString(page.properties[titleProperty].title);
};
