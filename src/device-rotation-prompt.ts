import {Svg} from "./svg";
import {AnimationDirection, DeviceOrientation, IConfig, ImageStyle} from "./iconfig";

/**
 * Default class config
 */
const DEFAULT_CONFIG: IConfig = {
    orientation: DeviceOrientation.Portrait,
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
    animationDirection: AnimationDirection.Clockwise,
    containerId: 'promptContainer',
    imageId: 'promptImage',
    textId: 'promptText',
    styleId: 'promptStyle',
    zIndex: undefined,
    mobileDetect: false,
    imageStyle: ImageStyle.Circle,
}

/**
 * Class to show device rotation fullscreen prompt, it activates immediately upon instantiation
 */
export class DeviceRotationPrompt {

    /**
     * Class config
     * @protected
     */
    protected readonly config;
    /**
     * Check orientation fn reference to be able to add and also remove event listener
     * @protected
     */
    protected readonly checkOrientationFn = this.checkOrientation.bind(this);

    /**
     * Constructor of class
     * @param config - to configure class, if configuration option is omitted, default one is used
     */
    constructor(config: IConfig = DEFAULT_CONFIG) {
        this.config = {...DEFAULT_CONFIG, ...config};
        if (this.canInitialize()) {
            this.generateCss();
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
     * @protected
     */
    protected canInitialize(): boolean {
        return !this.config.mobileDetect || this.isMobile();
    }

    /**
     * Method to generate HTML elements like main fullscreen div container, svg image and also description text
     * @protected
     */
    protected generateHtml(): void {
        const container = this.generateContainerHtml();
        this.generateSvgHtml(container);
        this.generateTextHtml(container);
    }

    /**
     * Method to generate the main fullscreen div container HTML element and append to body
     *
     * @returns The generated main fullscreen div container.
     */
    protected generateContainerHtml(): HTMLDivElement {
        const container = document.createElement('div');
        container.setAttribute('id', this.config.containerId!);
        document.body.appendChild(container);
        return container;
    }

    /**
     * Method to generate the svg image HTML element and append to container
     *
     * @param container - The container into which the SVG HTML element will be appended.
     */
    protected generateSvgHtml(container: HTMLDivElement): void {
        const svg = document.createElement('div');
        svg.innerHTML = this.deviceSvg;
        container.append(svg);
    }

    /**
     * Method to generate the description text HTML element and append to container
     *
     * @param container - The HTML container element where the text element will be appended.
     */
    protected generateTextHtml(container: HTMLDivElement): void {
        const text = document.createElement('div');
        text.setAttribute('id', this.config.textId!);
        text.innerText = this.config.text!;
        container.append(text);
    }

    /**
     * Method to generate styles for generated HTML elements
     * @protected
     */
    protected generateCss(): void {
        const style = document.createElement('style');
        style.setAttribute('id', this.config.styleId!);
        style.innerHTML = `
            ${this.generateContainerCss()}
            ${this.generateTextCss()}
            ${this.generateImageCss()}
            ${this.config.animationDisable ? '' : this.animationStyle}
        `;
        document.head.appendChild(style);
    }

    /**
     * Method to generate styles for generated container HTML element
     * @protected
     * @returns CSS of the container element
     */
    protected generateContainerCss(): string {
        return `
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
        `;
    }

    /**
     * Method to generate styles for generated text HTML element
     * @protected
     * @returns CSS of the text element
     */
    protected generateTextCss(): string {
        return `
            #${this.config.textId!} {
                display: ${this.isTextHidden};
                font-size: ${this.textSize};
                font-family: ${this.config.textFont};
                color: ${this.config.textColor};
                text-align: center;
            }
        `;
    }

    /**
     * Method to generate styles for generated image HTML element
     * @protected
     * @returns CSS of the image element
     */
    protected generateImageCss(): string {
        return `
            #${this.config.imageId} {
                height: ${this.imageSize};
                fill: ${this.config.imageColor};
                display: ${this.isImageHidden};
                transform: rotate(${this.initialAngle}deg);
                animation: rotation 3s ease infinite;
            }
        `;
    }

    /**
     * z-index rule for css, if zIndex property is present in config
     * @protected
     */
    protected get zIndexRule(): string {
        return this.config.zIndex === undefined ? '' : `z-index: ${this.config.zIndex}`;
    }

    /**
     * Animation css styles, @keyframes
     * @protected
     */
    protected get animationStyle(): string {
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
     * @protected
     */
    protected isDesiredOrientation(): boolean {
        return this.config.orientation === DeviceOrientation.Portrait ? window.innerHeight > window.innerWidth : window.innerHeight < window.innerWidth;
    }

    /**
     * Method to show/hide whole prompt
     * @protected
     */
    protected checkOrientation(): void {
        document.getElementById(this.config.containerId!)!.style.display = this.isDesiredOrientation() ? 'none' : 'flex';
    }

    /**
     * Size of image, returns size from config, or if image size is not presented in config it returns 60vh for portrait, 30vh for landscape
     * @protected
     */
    protected get imageSize(): string {
        return this.config.imageSize || (this.config.orientation === DeviceOrientation.Portrait ? '60vh' : '30vh');
    }

    /**
     * Size of text, returns size from config, or if text size is not presented in config it returns 10vh for portrait, 5vh for landscape
     * @protected
     */
    protected get textSize(): string {
        return this.config.textSize || (this.config.orientation === DeviceOrientation.Portrait ? '10vh' : '5vh');
    }

    /**
     * Initial angle of image, if animation is disabled, it returns final angle
     * @protected
     */
    protected get initialAngle(): number {
        if (this.config.animationDisable) {
            return this.finalAngle;
        }
        return this.config.orientation === DeviceOrientation.Portrait ? 90 * (this.config.animationDirection === AnimationDirection.Clockwise ? -1 : 1) : 0;
    }

    /**
     * Final angle of image
     * @protected
     */
    protected get finalAngle(): number {
        return this.config.orientation === DeviceOrientation.Portrait ? 0 : 90 * (this.config.animationDirection === AnimationDirection.Clockwise ? 1 : -1);
    }

    /**
     * Return display CSS property based on hideText property
     * @protected
     */
    protected get isTextHidden(): string {
        return this.config.hideText ? 'none' : 'block';
    }

    /**
     * Return display CSS property based on hideImage property
     * @protected
     */
    protected get isImageHidden(): string {
        return this.config.hideImage ? 'none' : 'block';
    }

    /**
     * Device SVG image
     * @protected
     */
    protected get deviceSvg(): string {
        return `<?xml version="1.0" encoding="UTF-8"?>${this.svgStyle}`;
    }

    /**
     * Get phone svg style based on imageStyle property
     * @protected
     */
    protected get svgStyle(): string {
        switch (this.config.imageStyle) {
            case ImageStyle.Rectangle:
                return Svg.getRectangleType(this.config.imageId!);
            case ImageStyle.None:
                return Svg.getNoneType(this.config.imageId!);
            default:
                return Svg.getCircleType(this.config.imageId!);
        }
    }

    /**
     * Detect if is mobile/tablet platform or not
     * @protected
     */
    protected isMobile(): boolean {
        return /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

}