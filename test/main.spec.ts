import {beforeEach, describe, expect, it, vi} from 'vitest'
import {DeviceOrientation, DeviceRotationPrompt, ImageStyle} from "../src";
import {Svg} from "../src/svg";

class DeviceRotationPromptTest extends DeviceRotationPrompt {
    canInitialize(): boolean {return super.canInitialize();}
    generateHtml(): void {return super.generateHtml();}
    generateStyles(): void {return super.generateStyles();}
    get zIndexRule(): string {return super.zIndexRule;}
    get animationStyle(): string {return super.animationStyle;}
    isDesiredOrientation(): boolean {return super.isDesiredOrientation();}
    checkOrientation(): void {return super.checkOrientation();}
    get imageSize(): string {return super.imageSize;}
    get textSize(): string {return super.textSize;}
    get initialAngle(): number {return super.initialAngle;}
    get finalAngle(): number {return super.finalAngle;}
    get isTextHidden(): string {return super.isTextHidden;}
    get isImageHidden(): string {return super.isImageHidden;}
    get deviceSvg(): string {return super.deviceSvg;}
    get svgStyle(): string {return super.svgStyle;}
    isMobile(): boolean {return super.isMobile();}
}

describe('Device rotation prompt', () => {

    let deviceRotationPrompt: DeviceRotationPromptTest;

    beforeEach(() => {
        vi.stubGlobal('document', {
            getElementById: vi.fn().mockReturnValue({style: {}}),
            body: {appendChild: vi.fn()},
            head: {appendChild: vi.fn()},
            createElement: vi.fn().mockReturnValue({setAttribute: vi.fn(), append: vi.fn()}),
        });
        vi.stubGlobal('window', {
            innerHeight: 0,
            innerWidth: 0,
        });
        vi.stubGlobal('addEventListener', vi.fn());
        deviceRotationPrompt = new DeviceRotationPromptTest();
    });

    describe('should get if library should be initialized', () => {
        it('default state', () => {
            expect(deviceRotationPrompt.canInitialize()).toBeTruthy();
        });

        it('mobileDetect true', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({mobileDetect: true});
            deviceRotationPrompt.isMobile = vi.fn().mockReturnValue(false);
            expect(deviceRotationPrompt.canInitialize()).toBeFalsy();
        });

        it('mobileDetect false', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({mobileDetect: false});
            expect(deviceRotationPrompt.canInitialize()).toBeTruthy();
        });
    });

    describe('should get if it is mobile platform', () => {
        it('mobile platform', () => {
            vi.stubGlobal('navigator', {userAgent: 'Android'});
            expect(deviceRotationPrompt.isMobile()).toBeTruthy();

            vi.stubGlobal('navigator', {userAgent: 'iPhone'});
            expect(deviceRotationPrompt.isMobile()).toBeTruthy();
        });

        it('non-mobile platform', () => {
            vi.stubGlobal('navigator', {userAgent: 'Pc'});
            expect(deviceRotationPrompt.isMobile()).toBeFalsy();
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
            expect(deviceRotationPrompt.isDesiredOrientation()).toBeFalsy();
        });

        it('default - actual portrait', () => {
            vi.stubGlobal('window', {innerHeight: 2, innerWidth: 1});
            expect(deviceRotationPrompt.isDesiredOrientation()).toBeTruthy();
        });

        it('expected portrait - actual landscape', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({orientation: DeviceOrientation.Portrait});
            vi.stubGlobal('window', {innerHeight: 1, innerWidth: 2});
            expect(deviceRotationPrompt.isDesiredOrientation()).toBeFalsy();
        });

        it('expected portrait - actual portrait', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({orientation: DeviceOrientation.Portrait});
            vi.stubGlobal('window', {innerHeight: 2, innerWidth: 1});
            expect(deviceRotationPrompt.isDesiredOrientation()).toBeTruthy();
        });

        it('expected landscape - actual landscape', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({orientation: DeviceOrientation.Landscape});
            vi.stubGlobal('window', {innerHeight: 1, innerWidth: 2});
            expect(deviceRotationPrompt.isDesiredOrientation()).toBeTruthy();
        });

        it('expected landscape - actual portrait', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({orientation: DeviceOrientation.Landscape});
            vi.stubGlobal('window', {innerHeight: 2, innerWidth: 1});
            expect(deviceRotationPrompt.isDesiredOrientation()).toBeFalsy();
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
            vi.spyOn(deviceRotationPrompt, 'isDesiredOrientation').mockReturnValue(true);
            deviceRotationPrompt.checkOrientation();
            expect(document.getElementById('')!.style.display).toBe('none');
        });

        it('desired orientation false', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({});
            vi.spyOn(deviceRotationPrompt, 'isDesiredOrientation').mockReturnValue(false);
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
            deviceRotationPrompt = new DeviceRotationPromptTest({imageStyle: ImageStyle.Circle}) ;
            const spy = vi.spyOn(Svg, 'getCircleType').mockReturnValue('circle')
            expect(deviceRotationPrompt.svgStyle).toBe('circle');
            spy.mockReset();
        });

        it('imageStyle rectangle', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({imageStyle: ImageStyle.Rectangle}) ;
            const spy = vi.spyOn(Svg, 'getRectangleType').mockReturnValue('rectangle')
            expect(deviceRotationPrompt.svgStyle).toBe('rectangle');
            spy.mockReset();
        });

        it('imageStyle none', () => {
            deviceRotationPrompt = new DeviceRotationPromptTest({imageStyle: ImageStyle.None}) ;
            const spy = vi.spyOn(Svg, 'getNoneType').mockReturnValue('none')
            expect(deviceRotationPrompt.svgStyle).toBe('none');
            spy.mockReset();
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