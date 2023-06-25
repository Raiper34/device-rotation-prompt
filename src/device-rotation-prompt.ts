export interface IConfig {
    orientation?: 'landscape' | 'portrait';
    backgroundColor?: string;
    imageColor?: string;
    imageSize?: string | undefined;
    hideImage?: boolean;
    text?: string;
    textColor?: string;
    textSize?: string | undefined;
    textFont?: string;
    hideText?: boolean;
    animationDisable?: boolean;
    containerId?: string;
    imageId?: string;
    textId?: string;
    styleId?: string;
    zIndex?: string | undefined;
}

const DEFAULT_CONFIG: IConfig = {
    orientation: 'landscape',
    backgroundColor: '#000000',
    imageColor: '#ffffff',
    imageSize: undefined,
    hideImage: false,
    text: 'Please rotate your device',
    textColor: '#ffffff',
    textSize: undefined,
    textFont: '\'Arial Black\', \'Arial Bold\', Gadget, sans-serif',
    hideText: false,
    animationDisable: false,
    containerId: 'promptContainer',
    imageId: 'promptImage',
    textId: 'promptText',
    styleId: 'promptStyle',
    zIndex: undefined,
}

export class DeviceRotationPrompt {

    private readonly config;
    private readonly checkOrientationFn = this.checkOrientation.bind(this);

    constructor(config: IConfig = DEFAULT_CONFIG) {
        this.config = {...DEFAULT_CONFIG, ...config};
        this.generateStyles();
        this.generateHtml();
        this.checkOrientation();
        addEventListener("resize", this.checkOrientationFn);
    }

    destroy(): void {
        removeEventListener("resize", this.checkOrientationFn);
        document.getElementById(this.config.containerId!)?.remove();
        document.getElementById(this.config.imageId!)?.remove();
        document.getElementById(this.config.textId!)?.remove();
        document.getElementById(this.config.styleId!)?.remove();
    }

    private generateHtml(): void {
        const container = document.createElement('div');
        container.setAttribute('id', this.config.containerId!);
        document.body.appendChild(container);

        const svg = document.createElement('div');
        svg.innerHTML = this.getDeviceImage();
        container.append(svg);

        const text = document.createElement('div');
        text.setAttribute('id', this.config.textId!);
        text.innerText = this.config.text!;
        container.append(text);
    }

    private generateStyles(): void {
        const style = document.createElement('style');
        style.setAttribute('id', this.config.styleId!);
        style.innerHTML = `
            #${this.config.containerId!} {
                height: 100vh;
                width: 100vw;
                position: fixed;
                top: 0px;
                left: 0px;
                background-color: ${this.config.backgroundColor!};
                justify-content: center;
                align-items: center;
                flex-direction: column;
                ${this.getZIndexRule()};
            }
            #${this.config.textId!} {
                display: ${this.isTextHiden};
                font-size: ${this.textSize};
                font-family: ${this.config.textFont};
                color: ${this.config.textColor};
                text-align: center;
            }
            #${this.config.imageId} {
                height: ${this.imageSize};
                fill: ${this.config.imageColor};
                display: ${this.isImageHiden};
                transform: rotate(${this.initialAngle}deg);
                animation: rotation 3s ease infinite;
            }
            ${this.config.animationDisable ? '' : this.getAnimationStyle()}
        `;
        document.head.appendChild(style);
    }

    private getZIndexRule(): string {
        return this.config.zIndex === undefined ? '' : `z-index: ${this.config.zIndex}`;
    }

    private getAnimationStyle(): string {
        return `
            @keyframes rotation {
                25% {
                    transform: rotate(${this.initialAngle}deg);
                }
                75% {
                    transform: rotate(${this.finalAngle}deg);
                }
                100% {
                    transform: rotate(${this.finalAngle}deg);
                }
            }
        `;
    }

    private isDesiredOrientation(): boolean {
        return this.config.orientation === 'portrait' ? window.innerHeight > window.innerWidth : window.innerHeight < window.innerWidth;
    }

    private checkOrientation(): void {
        document.getElementById(this.config.containerId!)!.style.display = this.isDesiredOrientation() ? 'none' : 'flex';
    }

    private get imageSize(): string {
        return this.config.imageSize || (this.config.orientation === 'portrait' ? '60vh' : '30vh');
    }

    private get textSize(): string {
        return this.config.textSize || (this.config.orientation === 'portrait' ? '10vh' : '5vh');
    }

    private get initialAngle(): number {
        if (this.config.animationDisable) {
            return this.config.orientation === 'portrait' ? 0 : 90;
        }
        return this.config.orientation === 'portrait' ? 90 : 0;
    }

    private get finalAngle(): number {
        return this.config.orientation === 'portrait' ? 0 : 90;
    }

    private get isTextHiden(): string {
        return this.config.hideText ? 'none' : 'block';
    }

    private get isImageHiden(): string {
        return this.config.hideImage ? 'none' : 'block';
    }

    private getDeviceImage(): string {
        return `
        <?xml version="1.0" encoding="UTF-8"?>
        <svg id="${this.config.imageId}" version="1.1" viewBox="0 0 159.83 285.98" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
          <g transform="translate(-25.124 -5.6761)">
            <path transform="scale(.26458)" d="m170.54 21.453c-41.877 0-75.59 33.715-75.59 75.592v929.68c0 41.877 33.713 75.59 75.59 75.59h452.89c41.877 0 75.59-33.713 75.59-75.59v-929.68c0-41.877-33.713-75.592-75.59-75.592zm51.5 56.908h349.89c32.353 0 58.4 26.045 58.4 58.398v718.25c0 32.353-26.047 58.398-58.4 58.398h-349.89c-32.353 0-58.4-26.045-58.4-58.398v-718.25c0-32.353 26.047-58.398 58.4-58.398zm174.95 866.37a58.589 58.589 0 0 1 58.588 58.59 58.589 58.589 0 0 1-58.588 58.588 58.589 58.589 0 0 1-58.59-58.588 58.589 58.589 0 0 1 58.59-58.59z"/>
          </g>
        </svg>
        `;
    }

}