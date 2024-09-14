/**
 * Class to hold different phone svg styles
 */
export class Svg {

    /**
     * Get phone svg style 1 with circle button
     * @param imageId - id of svg image
     */
    static getCircleType(imageId: string): string {
        return `
        <svg id="${imageId}" version="1.1" viewBox="0 0 159.83 285.98" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
          <g transform="translate(-25.124 -5.6761)">
            <path transform="scale(.26458)" d="m170.54 21.453c-41.877 0-75.59 33.715-75.59 75.592v929.68c0 41.877 33.713 75.59 75.59 75.59h452.89c41.877 0 75.59-33.713 75.59-75.59v-929.68c0-41.877-33.713-75.592-75.59-75.592zm51.5 56.908h349.89c32.353 0 58.4 26.045 58.4 58.398v718.25c0 32.353-26.047 58.398-58.4 58.398h-349.89c-32.353 0-58.4-26.045-58.4-58.398v-718.25c0-32.353 26.047-58.398 58.4-58.398zm174.95 866.37a58.589 58.589 0 0 1 58.588 58.59 58.589 58.589 0 0 1-58.588 58.588 58.589 58.589 0 0 1-58.59-58.588 58.589 58.589 0 0 1 58.59-58.59z"/>
          </g>
        </svg>
        `
    }

    /**
     * Get phone svg style 1 with rounded rectangle button
     * @param imageId - id of svg image
     */
    static getRectangleType(imageId: string): string {
        return `
        <svg id="${imageId}" width="159.83mm" height="285.98mm" version="1.1" viewBox="0 0 159.83 285.98" xmlns="http://www.w3.org/2000/svg">
            <path transform="scale(.26458)" d="m75.58 0c-41.876 0-75.588 33.713-75.588 75.59v929.67c0 41.876 33.711 75.588 75.588 75.588h452.88c41.876 0 75.59-33.711 75.59-75.588v-929.67c0-41.876-33.713-75.59-75.59-75.59h-452.88zm51.5 56.906h349.89c32.353 0 58.398 26.046 58.398 58.398v718.24c0 32.353-26.046 58.398-58.398 58.398h-349.89c-32.353 0-58.398-26.046-58.398-58.398v-718.24c0-32.353 26.046-58.398 58.398-58.398zm78.74 888.85h192.41c15.844 0 28.602 13.826 28.602 31v11.279c0 17.174-12.757 31-28.602 31h-192.41c-15.844 0-28.602-13.826-28.602-31v-11.279c0-17.174 12.757-31 28.602-31z" stroke-width=".99999"/>
        </svg>
        `;
    }

    /**
     * Get phone svg style 1 without button, screen only
     * @param imageId - id of svg image
     */
    static getNoneType(imageId: string): string {
        return `
        <svg id="${imageId}" width="159.83mm" height="285.98mm" version="1.1" viewBox="0 0 159.83 285.98" xmlns="http://www.w3.org/2000/svg">
            <path transform="scale(.26458)" d="m75.58 0c-41.876 0-75.588 33.713-75.588 75.59v929.67c0 41.876 33.712 75.588 75.588 75.588h452.88c41.876 0 75.59-33.711 75.59-75.588v-929.67c0-41.876-33.713-75.59-75.59-75.59h-452.88zm33.467 79.871h385.95c35.687 0 64.418 28.731 64.418 64.418v792.27c0 35.687-28.731 64.416-64.418 64.416h-385.95c-35.687 0-64.416-28.729-64.416-64.416v-792.27c0-35.687 28.729-64.418 64.416-64.418z" stroke-width=".99999"/>
        </svg>
        `;
    }
}