import {beforeEach, describe, expect, it, vi} from 'vitest'
import {AnimationDirection, DeviceOrientation, DeviceRotationPrompt, IConfig, ImageStyle} from "../src";
import {Svg} from "../src/svg";
import {DEFAULT_CONFIG} from "../src/device-rotation-prompt";

class DeviceRotationPromptTest extends DeviceRotationPrompt {

    get configSuper(): IConfig {
        return this.config;
    }

    initialize(): void {
        return super.initialize();
    }

    get canInitialize(): boolean {
        return super.canInitialize;
    }

    generateHtml(): void {
        return super.generateHtml();
    }

    generateStyles(): void {
        return super.generateStyles();
    }

    get zIndexRule(): string {
        return super.zIndexRule;
    }

    get animationStyle(): string {
        return super.animationStyle;
    }

    get isDesiredOrientation(): boolean {
        return super.isDesiredOrientation;
    }

    checkOrientation(): void {
        return super.checkOrientation();
    }

    get imageSize(): string {
        return super.imageSize;
    }

    get textSize(): string {
        return super.textSize;
    }

    get initialAngle(): number {
        return super.initialAngle;
    }

    get finalAngle(): number {
        return super.finalAngle;
    }

    get isTextHidden(): string {
        return super.isTextHidden;
    }

    get isImageHidden(): string {
        return super.isImageHidden;
    }

    get deviceSvg(): string {
        return super.deviceSvg;
    }

    get svgStyle(): string {
        return super.svgStyle;
    }

    get isMobile(): boolean {
        return super.isMobile;
    }
}

describe('Device rotation prompt', () => {

    let deviceRotationPrompt: DeviceRotationPromptTest;

    beforeEach(() => {
        vi.stubGlobal('document', {
            getElementById: vi.fn().mockReturnValue({remove: vi.fn(), style: {}}),
            body: {appendChild: vi.fn()},
            head: {appendChild: vi.fn()},
            createElement: vi.fn().mockReturnValue({setAttribute: vi.fn(), append: vi.fn()}),
        });
        vi.stubGlobal('window', {
            innerHeight: 0,
            innerWidth: 0,
        });
        vi.stubGlobal('addEventListener', vi.fn());
        vi.stubGlobal('removeEventListener', vi.fn());
        deviceRotationPrompt = new DeviceRotationPromptTest();
    });

    describe('should be instantiated', () => {
        it('default', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest();
            expect(deviceRotationPrompt.configSuper).toEqual(DEFAULT_CONFIG);
        });

        it('configured partial', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({zIndex: 999});
            expect(deviceRotationPrompt.configSuper).toEqual({...DEFAULT_CONFIG, zIndex: 999});
        });

        it('configured', () => {
            const config = {
                orientation: DeviceOrientation.Landscape,
                backgroundColor: '#111111',
                imageColor: '#000000',
                imageSize: '10px',
                hideImage: true,
                text: 'Please rotate your device changed',
                textColor: '#ffffff',
                textSize: undefined,
                textFont: 'Font',
                hideText: true,
                animationDisable: true,
                animationDirection: AnimationDirection.Anticlockwise,
                containerId: 'promptContainerChanged',
                imageId: 'promptImageChanged',
                textId: 'promptTextChanged',
                styleId: 'promptStyleChanged',
                zIndex: 999,
                mobileDetect: true,
                imageStyle: ImageStyle.Rectangle,
            };
            deviceRotationPrompt = new DeviceRotationPromptTest(config);
            expect(deviceRotationPrompt.configSuper).toEqual(config);
        });
    })

    describe('should initialize lib', () => {
        beforeEach(() => {
            vi.spyOn(deviceRotationPrompt, 'generateStyles');
            vi.spyOn(deviceRotationPrompt, 'generateHtml');
            vi.spyOn(deviceRotationPrompt, 'checkOrientation');
            vi.clearAllMocks();
        });

        it('canInitialize false - should not be initialized', () => {
            vi.spyOn(deviceRotationPrompt, 'canInitialize', 'get').mockReturnValue(false);
            deviceRotationPrompt.initialize();
            expect(deviceRotationPrompt.generateStyles).not.toHaveBeenCalled();
            expect(deviceRotationPrompt.generateHtml).not.toHaveBeenCalled();
            expect(deviceRotationPrompt.checkOrientation).not.toHaveBeenCalled();
            expect(addEventListener).not.toHaveBeenCalled();
        });

        it('canInitialize true - should initialize', () => {
            vi.spyOn(deviceRotationPrompt, 'canInitialize', 'get').mockReturnValue(true);
            deviceRotationPrompt.initialize();
            expect(deviceRotationPrompt.generateStyles).toHaveBeenCalled();
            expect(deviceRotationPrompt.generateHtml).toHaveBeenCalled();
            expect(deviceRotationPrompt.checkOrientation).toHaveBeenCalled();
            expect(addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
        });
    })

    describe('should get if library should be initialized', () => {
        it('default state', () => {
            expect(deviceRotationPrompt.canInitialize).toBeTruthy();
        });

        it('mobileDetect true', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({mobileDetect: true});
            vi.spyOn(deviceRotationPrompt, 'isMobile', 'get').mockReturnValue(false);
            expect(deviceRotationPrompt.canInitialize).toBeFalsy();
        });

        it('mobileDetect false', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({mobileDetect: false});
            expect(deviceRotationPrompt.canInitialize).toBeTruthy();
        });
    });

    describe('should get if it is mobile platform', () => {
        it('mobile platform', () => {
            vi.stubGlobal('navigator', {userAgent: 'Android'});
            expect(deviceRotationPrompt.isMobile).toBeTruthy();

            vi.stubGlobal('navigator', {userAgent: 'iPhone'});
            expect(deviceRotationPrompt.isMobile).toBeTruthy();
        });

        it('non-mobile platform', () => {
            vi.stubGlobal('navigator', {userAgent: 'Pc'});
            expect(deviceRotationPrompt.isMobile).toBeFalsy();
        });
    });

    describe('should get z-index rule', () => {
        it('default', () => {
            expect(deviceRotationPrompt.zIndexRule).toBe('');
        });

        it('z-index 999', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({zIndex: 999});
            expect(deviceRotationPrompt.zIndexRule).toBe('z-index: 999');
        });
    });

    it('should get animation style', () => {
        vi.spyOn(deviceRotationPrompt, 'initialAngle', 'get').mockReturnValue(123);
        vi.spyOn(deviceRotationPrompt, 'finalAngle', 'get').mockReturnValue(321);
        expect(deviceRotationPrompt.animationStyle.replace(/\s/g, ''))
            .toBe('@keyframesrotation{25%{transform:rotate(123deg);}75%{transform:rotate(321deg);}100%{transform:rotate(321deg);}}');
    });

    describe('should get if it desired orientation', () => {
        it('default - actual landscape', () => {
            vi.stubGlobal('window', {innerHeight: 1, innerWidth: 2});
            expect(deviceRotationPrompt.isDesiredOrientation).toBeFalsy();
        });

        it('default - actual portrait', () => {
            vi.stubGlobal('window', {innerHeight: 2, innerWidth: 1});
            expect(deviceRotationPrompt.isDesiredOrientation).toBeTruthy();
        });

        it('expected portrait - actual landscape', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({orientation: DeviceOrientation.Portrait});
            vi.stubGlobal('window', {innerHeight: 1, innerWidth: 2});
            expect(deviceRotationPrompt.isDesiredOrientation).toBeFalsy();
        });

        it('expected portrait - actual portrait', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({orientation: DeviceOrientation.Portrait});
            vi.stubGlobal('window', {innerHeight: 2, innerWidth: 1});
            expect(deviceRotationPrompt.isDesiredOrientation).toBeTruthy();
        });

        it('expected landscape - actual landscape', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({orientation: DeviceOrientation.Landscape});
            vi.stubGlobal('window', {innerHeight: 1, innerWidth: 2});
            expect(deviceRotationPrompt.isDesiredOrientation).toBeTruthy();
        });

        it('expected landscape - actual portrait', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({orientation: DeviceOrientation.Landscape});
            vi.stubGlobal('window', {innerHeight: 2, innerWidth: 1});
            expect(deviceRotationPrompt.isDesiredOrientation).toBeFalsy();
        });
    });

    describe('should get image size', () => {
        it('default - undefined, orientation portrait', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({orientation: DeviceOrientation.Portrait});
            expect(deviceRotationPrompt.imageSize).toBe('60vh');
        });

        it('default - undefined, orientation landscape', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({orientation: DeviceOrientation.Landscape});
            expect(deviceRotationPrompt.imageSize).toBe('30vh');
        });

        it('configured', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({imageSize: '100px'});
            expect(deviceRotationPrompt.imageSize).toBe('100px');
        });
    });

    describe('should get text size', () => {
        it('default - undefined, orientation portrait', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({orientation: DeviceOrientation.Portrait});
            expect(deviceRotationPrompt.textSize).toBe('10vh');
        });

        it('default - undefined, orientation landscape', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({orientation: DeviceOrientation.Landscape});
            expect(deviceRotationPrompt.textSize).toBe('5vh');
        });

        it('configured', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({textSize: '100px'});
            expect(deviceRotationPrompt.textSize).toBe('100px');
        });
    });

    describe('should get if text should be hidden', () => {
        it('default', () => {
            expect(deviceRotationPrompt.isTextHidden).toBe('block');
        });

        it('hideText false', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({hideText: false});
            expect(deviceRotationPrompt.isTextHidden).toBe('block');
        });

        it('hideText true', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({hideText: true});
            expect(deviceRotationPrompt.isTextHidden).toBe('none');
        });
    });

    describe('should get if image should be hidden', () => {
        it('default', () => {
            expect(deviceRotationPrompt.isImageHidden).toBe('block');
        });

        it('hideImage false', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({hideImage: false});
            expect(deviceRotationPrompt.isImageHidden).toBe('block');
        });

        it('hideImage true', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({hideImage: true});
            expect(deviceRotationPrompt.isImageHidden).toBe('none');
        });
    });

    it('should get device svg', () => {
        deviceRotationPrompt = new DeviceRotationPromptTest({});
        vi.spyOn(deviceRotationPrompt, 'svgStyle', 'get').mockReturnValue('svg');
        expect(deviceRotationPrompt.deviceSvg).toBe('<?xml version="1.0" encoding="UTF-8"?>svg')
    });

    describe('should check orientation', () => {
        it('desired orientation true', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({});
            vi.spyOn(deviceRotationPrompt, 'isDesiredOrientation', 'get').mockReturnValue(true);
            deviceRotationPrompt.checkOrientation();
            expect(document.getElementById('')!.style.display).toBe('none');
        });

        it('desired orientation false', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({});
            vi.spyOn(deviceRotationPrompt, 'isDesiredOrientation', 'get').mockReturnValue(false);
            deviceRotationPrompt.checkOrientation();
            expect(document.getElementById('')!.style.display).toBe('flex');
        });
    });

    describe('should get svg style', () => {
        it('default', () => {
            const spy = vi.spyOn(Svg, 'getCircleType').mockReturnValue('circle')
            expect(deviceRotationPrompt.svgStyle).toBe('circle');
            spy.mockReset();
        });

        it('imageStyle circle', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({imageStyle: ImageStyle.Circle});
            const spy = vi.spyOn(Svg, 'getCircleType').mockReturnValue('circle')
            expect(deviceRotationPrompt.svgStyle).toBe('circle');
            spy.mockReset();
        });

        it('imageStyle rectangle', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({imageStyle: ImageStyle.Rectangle});
            const spy = vi.spyOn(Svg, 'getRectangleType').mockReturnValue('rectangle')
            expect(deviceRotationPrompt.svgStyle).toBe('rectangle');
            spy.mockReset();
        });

        it('imageStyle none', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({imageStyle: ImageStyle.None});
            const spy = vi.spyOn(Svg, 'getNoneType').mockReturnValue('none')
            expect(deviceRotationPrompt.svgStyle).toBe('none');
            spy.mockReset();
        });
    });

    describe('should get initial angle', () => {
        it('default', () => {
            expect(deviceRotationPrompt.initialAngle).toBe(-90);
        });

        it('animationDisable true - should get final angle', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({animationDisable: true});
            vi.spyOn(deviceRotationPrompt, 'finalAngle', 'get').mockReturnValue(123);
            expect(deviceRotationPrompt.initialAngle).toBe(123);
        });

        it('orientation portrait, animationDirection clockwise', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({
                animationDisable: false,
                animationDirection: AnimationDirection.Clockwise,
                orientation: DeviceOrientation.Portrait
            });
            expect(deviceRotationPrompt.initialAngle).toBe(-90);
        });

        it('orientation portrait, animationDirection anticlockwise', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({
                animationDisable: false,
                animationDirection: AnimationDirection.Anticlockwise,
                orientation: DeviceOrientation.Portrait
            });
            expect(deviceRotationPrompt.initialAngle).toBe(90);
        });

        it('orientation landscape, animationDirection clockwise', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({
                animationDisable: false,
                animationDirection: AnimationDirection.Clockwise,
                orientation: DeviceOrientation.Landscape
            });
            expect(deviceRotationPrompt.initialAngle).toBe(0);
        });

        it('orientation landscape, animationDirection anticlockwise', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({
                animationDisable: false,
                animationDirection: AnimationDirection.Anticlockwise,
                orientation: DeviceOrientation.Landscape
            });
            expect(deviceRotationPrompt.initialAngle).toBe(0);
        });
    });

    describe('should get final angle', () => {
        it('default', () => {
            expect(deviceRotationPrompt.finalAngle).toBe(0);
        });

        it('orientation portrait, animationDirection clockwise', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({
                animationDirection: AnimationDirection.Clockwise,
                orientation: DeviceOrientation.Portrait
            });
            expect(deviceRotationPrompt.finalAngle).toBe(0);
        });

        it('orientation portrait, animationDirection anticlockwise', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({
                animationDirection: AnimationDirection.Anticlockwise,
                orientation: DeviceOrientation.Portrait
            });
            expect(deviceRotationPrompt.finalAngle).toBe(0);
        });

        it('orientation landscape, animationDirection clockwise', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({
                animationDirection: AnimationDirection.Clockwise,
                orientation: DeviceOrientation.Landscape
            });
            expect(deviceRotationPrompt.finalAngle).toBe(90);
        });

        it('orientation landscape, animationDirection anticlockwise', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({
                animationDirection: AnimationDirection.Anticlockwise,
                orientation: DeviceOrientation.Landscape
            });
            expect(deviceRotationPrompt.finalAngle).toBe(-90);
        });
    });

    describe('should destroy implementation', () => {
        it('default', () => {
            deviceRotationPrompt.destroy();
            expect(document.getElementById('stub')?.remove).toHaveBeenCalledTimes(4);
            expect(document.getElementById).toHaveBeenCalledWith('promptContainer');
            expect(document.getElementById).toHaveBeenCalledWith('promptImage');
            expect(document.getElementById).toHaveBeenCalledWith('promptText');
            expect(document.getElementById).toHaveBeenCalledWith('promptStyle');
            expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
        });

        it('configured id', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({
                containerId: 'cId',
                imageId: 'iId',
                textId: 'tId',
                styleId: 'sId'
            });
            deviceRotationPrompt.destroy();
            expect(document.getElementById).toHaveBeenCalledWith('cId');
            expect(document.getElementById).toHaveBeenCalledWith('iId');
            expect(document.getElementById).toHaveBeenCalledWith('tId');
            expect(document.getElementById).toHaveBeenCalledWith('sId');
        });
    });
});

describe('Svg', () => {
    it('should get circle image', () => {
        expect(Svg.getCircleType('identifier').includes('identifier')).toBeTruthy();
    });

    it('should get rectangle image', () => {
        expect(Svg.getRectangleType('identifier').includes('identifier')).toBeTruthy();
    });

    it('should get none image', () => {
        expect(Svg.getNoneType('identifier').includes('identifier')).toBeTruthy();
    });
});