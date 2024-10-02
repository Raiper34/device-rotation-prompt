/**
 * Device orientation enum
 */
export enum DeviceOrientation {
    Landscape = 'landscape',
    Portrait = 'portrait',
}

/**
 * Animation direction enum
 */
export enum AnimationDirection {
    Clockwise = 'clockwise',
    Anticlockwise = 'anticlockwise',
}

/**
 * Image style enum
 */
export enum ImageStyle {
    None = 'none',
    Circle = 'circle',
    Rectangle = 'rectangle',
}

/**
 * Config interface to modify behaviour and style of prompt
 */
export interface IConfig {
    /**
     * The orientation you want to force, if orientation is different, prompt is showed.
     * @default 'landscape'
     */
    orientation?: DeviceOrientation;
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
    animationDirection?: AnimationDirection;
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
    imageStyle?: ImageStyle;
}