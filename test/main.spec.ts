import {beforeEach, describe, expect, it, vi} from 'vitest'
import {DeviceRotationPrompt} from "../src";

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

    it('should get if library should be initialized', () => {
        expect(deviceRotationPrompt.canInitialize()).toBeTruthy();

        deviceRotationPrompt = new DeviceRotationPromptTest({mobileDetect: true});
        deviceRotationPrompt.isMobile = vi.fn().mockReturnValue(false);
        expect(deviceRotationPrompt.canInitialize()).toBeFalsy();
    });

    it('should get if it is mobile platform', () => {
        vi.stubGlobal('navigator', {userAgent: 'Android'});
        expect(deviceRotationPrompt.isMobile()).toBeTruthy();

        vi.stubGlobal('navigator', {userAgent: 'iPhone'});
        expect(deviceRotationPrompt.isMobile()).toBeTruthy();

        vi.stubGlobal('navigator', {userAgent: 'Pc'});
        expect(deviceRotationPrompt.isMobile()).toBeFalsy();
    });

});