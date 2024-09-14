import { Svg } from "./svg";

export interface IConfig {
    /**
     * The orientation you want to force, if orientation is different, prompt is showed.
     * @default 'landscape'
     */
    orientation?: 'landscape' | 'portrait';
    /**
     * Background color of whole prompt (all css possibilities, like hexa color '#000000', 'red'...)
     * @default '#000000'
     */
    backgroundColor?: string;
    /**
     * Color of device image (all css possibilities, like hexa color '#000000', 'red'...)
     * @default '#ffffff'
     */
    imageColor?: string;
    /**
     * Size of device image (all css units like px, em, rem, vh...)
     * @default '60vh' for portrait '30vh' for landscape
     */
    imageSize?: string | undefined;
    /**
     * Hide/show image
     * @default false
     */
    hideImage?: boolean;
    /**
     * Description text to show
     * @default 'Please rotate your device'
     */
    text?: string;
    /**
     * Color of description text (all css possibilities, like hexa color '#000000', 'red'...)
     * @default '#ffffff'
     */
    textColor?: string;
    /**
     * Size of description text (all css units like px, em, rem, vh...)
     * @default '10vh' for portrait '5vh' for landscape
     */
    textSize?: string | undefined;
    /**
     * Font of description text
     * @default '\'Arial Black\', \'Arial Bold\', Gadget, sans-serif'
     */
    textFont?: string;
    /**
     * Hide/show description text
     * @default false
     */
    hideText?: boolean;
    /**
     * Enable/disable image animation
     * @default false
     */
    animationDisable?: boolean;
    /**
     * Direction of image animation
     * @default 'clockwise'
     */
    animationDirection?: 'clockwise' | 'anticlockwise';
    /**
     * Id of whole container prompt
     * @default 'promptContainer'
     */
    containerId?: string;
    /**
     * Id of svg image
     * @default 'promptImage'
     */
    imageId?: string;
    /**
     * Id of container with description text
     * @default 'promptText'
     */
    textId?: string;
    /**
     * Id of style tag, where all styles of this library are defined
     * @default 'promptStyle'
     */
    styleId?: string;
    /**
     * z-index of whole prompt
     * @default undefined
     */
    zIndex?: number | undefined;
    /**
     * Turn on/off automatic mobile/tablet detection
     * When automatic detection is on, then prompt is show only on mobile/tablet devices
     * @default false
     */
    mobileDetect?: boolean;
    /**
     * Phone style
     * @default 'circle'
     */
    imageStyle?: 'circle' | 'rectangle' | 'none';
}

/**
 * Default class config
 */
const DEFAULT_CONFIG: IConfig = {
    orientation: 'portrait',
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
    animationDirection: 'clockwise',
    containerId: 'promptContainer',
    imageId: 'promptImage',
    textId: 'promptText',
    styleId: 'promptStyle',
    zIndex: undefined,
    mobileDetect: false,
    imageStyle: 'circle',
}

/**
 * Class to show device rotation fullscreen prompt, it activates immediately upon instantiation
 */
export class DeviceRotationPrompt {

    /**
     * Class config
     * @private
     */
    private readonly config;
    /**
     * Check orientation fn reference to be able to add and also remove event listener
     * @private
     */
    private readonly checkOrientationFn = this.checkOrientation.bind(this);

    /**
     * Constructor of class
     * @param config - to configure class, if configuration option is omitted, default one is used
     */
    constructor(config: IConfig = DEFAULT_CONFIG) {
        this.config = {...DEFAULT_CONFIG, ...config};
        if (this.canInitialize()) {
            this.generateStyles();
            this.generateHtml();
            this.checkOrientation();
            addEventListener("resize", this.checkOrientationFn);
        }
    }

    /**
     * Method to destroy all created html/css elements and also remove event listener for orientation detection, handy when you do not want to use library anymore
     */
    destroy(): void {
        removeEventListener("resize", this.checkOrientationFn);
        document.getElementById(this.config.containerId!)?.remove();
        document.getElementById(this.config.imageId!)?.remove();
        document.getElementById(this.config.textId!)?.remove();
        document.getElementById(this.config.styleId!)?.remove();
    }

    /**
     * Method to determine, if library and all functionality can be initialized
     * @private
     */
    private canInitialize(): boolean {
        return !this.config.mobileDetect || this.isMobile();
    }

    /**
     * Method to generate HTML elements like main fullscreen div container, svg image and also description text
     * @private
     */
    private generateHtml(): void {
        const container = document.createElement('div');
        container.setAttribute('id', this.config.containerId!);
        document.body.appendChild(container);

        const svg = document.createElement('div');
        svg.innerHTML = this.deviceSvg;
        container.append(svg);

        const text = document.createElement('div');
        text.setAttribute('id', this.config.textId!);
        text.innerText = this.config.text!;
        container.append(text);
    }

    /**
     * Method to generate styles for generated HTML elements
     * @private
     */
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
                ${this.zIndexRule};
            }
            #${this.config.textId!} {
                display: ${this.isTextHidden};
                font-size: ${this.textSize};
                font-family: ${this.config.textFont};
                color: ${this.config.textColor};
                text-align: center;
            }
            #${this.config.imageId} {
                height: ${this.imageSize};
                fill: ${this.config.imageColor};
                display: ${this.isImageHidden};
                transform: rotate(${this.initialAngle}deg);
                animation: rotation 3s ease infinite;
            }
            ${this.config.animationDisable ? '' : this.animationStyle}
        `;
        document.head.appendChild(style);
    }

    /**
     * z-index rule for css, if zIndex property is present in config
     * @private
     */
    private get zIndexRule(): string {
        return this.config.zIndex === undefined ? '' : `z-index: ${this.config.zIndex}`;
    }

    /**
     * Animation css styles, @keyframes
     * @private
     */
    private get animationStyle(): string {
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

    /**
     * Method to find if current orientation is desired one
     * @returns true if orientation is same as you desire, false otherwise
     * @private
     */
    private isDesiredOrientation(): boolean {
        return this.config.orientation === 'portrait' ? window.innerHeight > window.innerWidth : window.innerHeight < window.innerWidth;
    }

    /**
     * Method to show/hide whole prompt
     * @private
     */
    private checkOrientation(): void {
        document.getElementById(this.config.containerId!)!.style.display = this.isDesiredOrientation() ? 'none' : 'flex';
    }

    /**
     * Size of image, returns size from config, or if image size is not presented in config it returns 60vh for portrait, 30vh for landscape
     * @private
     */
    private get imageSize(): string {
        return this.config.imageSize || (this.config.orientation === 'portrait' ? '60vh' : '30vh');
    }

    /**
     * Size of text, returns size from config, or if text size is not presented in config it returns 10vh for portrait, 5vh for landscape
     * @private
     */
    private get textSize(): string {
        return this.config.textSize || (this.config.orientation === 'portrait' ? '10vh' : '5vh');
    }

    /**
     * Initial angle of image, if animation is disabled, it returns final angle
     * @private
     */
    private get initialAngle(): number {
        if (this.config.animationDisable) {
            return this.finalAngle;
        }
        return this.config.orientation === 'portrait' ? 90 * (this.config.animationDirection === 'clockwise' ? -1 : 1) : 0;
    }

    /**
     * Final angle of image
     * @private
     */
    private get finalAngle(): number {
        return this.config.orientation === 'portrait' ? 0 : 90 * (this.config.animationDirection === 'clockwise' ? 1 : -1);
    }

    /**
     * Return display CSS property based on hideText property
     * @private
     */
    private get isTextHidden(): string {
        return this.config.hideText ? 'none' : 'block';
    }

    /**
     * Return display CSS property based on hideImage property
     * @private
     */
    private get isImageHidden(): string {
        return this.config.hideImage ? 'none' : 'block';
    }

    /**
     * Device SVG image
     * @private
     */
    private get deviceSvg(): string {
        return `<?xml version="1.0" encoding="UTF-8"?>${this.svgStyle}`;
    }

    /**
     * Get phone svg style based on imageStyle property
     * @private
     */
    private get svgStyle(): string {
        switch (this.config.imageStyle) {
            case 'rectangle':
                return Svg.getRectangleType(this.config.imageId!);
            case 'none':
                return Svg.getNoneType(this.config.imageId!);
            default:
                return Svg.getCircleType(this.config.imageId!);
        }
    }

    /**
     * Detect if is mobile/tablet platform or not
     * @private
     */
    private isMobile(): boolean {
        return /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

}