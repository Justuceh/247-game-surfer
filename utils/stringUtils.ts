export function findClosestString(searchString: any, stringList: any[]) {
	let closestString = null;
	let minDistance = Infinity;

	for (let i = 0; i < stringList.length; i++) {
		const currentString = stringList[i];
		const distance = levenshteinDistance(searchString, currentString);

		if (distance < minDistance) {
			minDistance = distance;
			closestString = currentString;
		}
	}
	return closestString;
}

export function removeEditionWords(str: string | undefined) {
	const editionWords = [
		'gold edition',
		'deluxe edition',
		'ultimate edition',
		'special edition',
		'standard edition',
		'platinum edition',
	];
	const regex = new RegExp(editionWords.join('|'), 'gi');
	const modifiedString = str?.replace(regex, '').trim();
	return modifiedString?.replace(/:$/, '');
}

function levenshteinDistance(source: any, target: any) {
	const sourceLength = source.length;
	const targetLength = target.length;

	// Initialize the matrix with dimensions (sourceLength + 1) x (targetLength + 1)
	const distanceMatrix = Array.from({ length: sourceLength + 1 }, () =>
		Array(targetLength + 1).fill(0)
	);

	// Initialize the first row and column of the matrix
	for (let i = 0; i <= sourceLength; i++) {
		distanceMatrix[i][0] = i;
	}

	for (let j = 0; j <= targetLength; j++) {
		distanceMatrix[0][j] = j;
	}

	// Fill in the rest of the matrix
	for (let i = 1; i <= sourceLength; i++) {
		for (let j = 1; j <= targetLength; j++) {
			const sourceChar = source[i - 1];
			const targetChar = target[j - 1];

			if (sourceChar === targetChar) {
				// Characters are equal, no operation needed
				distanceMatrix[i][j] = distanceMatrix[i - 1][j - 1];
			} else {
				// Characters are different, find the minimum distance among deletion, insertion, and substitution
				const deletion = distanceMatrix[i - 1][j] + 1;
				const insertion = distanceMatrix[i][j - 1] + 1;
				const substitution = distanceMatrix[i - 1][j - 1] + 1;

				distanceMatrix[i][j] = Math.min(deletion, insertion, substitution);
			}
		}
	}

	// Return the final Levenshtein distance
	return distanceMatrix[sourceLength][targetLength];
}
