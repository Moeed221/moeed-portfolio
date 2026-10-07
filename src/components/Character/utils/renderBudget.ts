// Limit only the 3D backing buffer; CSS dimensions and artwork stay unchanged.
export function isMobileRender() {
  return window.matchMedia("(pointer: coarse)").matches && window.innerWidth <= 1024;
}

export class RenderBudget {
  readonly mobile: boolean;
  readonly maxRatio: number;
  pixelRatio: number;
  private sampleTime = 0;
  private sampleFrames = 0;
  private warmup = 1500;

  constructor(mobile: boolean, nativeRatio: number) {
    this.mobile = mobile;
    this.maxRatio = mobile ? Math.min(nativeRatio, 1.5) : nativeRatio;
    this.pixelRatio = this.maxRatio;
  }

  resetSample() {
    this.sampleTime = 0;
    this.sampleFrames = 0;
    this.warmup = 1500;
  }

  // Sustained slow frames reduce the mobile buffer in small steps. Never
  // upscale mid-visit or react to tab restoration/startup compilation stalls.
  sample(frameMs: number) {
    if (!this.mobile || frameMs <= 0 || frameMs > 100) return false;
    if (this.warmup > 0) {
      this.warmup -= frameMs;
      return false;
    }
    this.sampleTime += frameMs;
    this.sampleFrames++;
    if (this.sampleTime < 2000) return false;
    const average = this.sampleTime / this.sampleFrames;
    this.sampleTime = 0;
    this.sampleFrames = 0;
    const minimum = Math.min(1, this.maxRatio);
    if (average <= 24 || this.pixelRatio <= minimum) return false;
    this.pixelRatio = Math.max(minimum, this.pixelRatio - 0.25);
    this.warmup = 1500;
    return true;
  }
}
