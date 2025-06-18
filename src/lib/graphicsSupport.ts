interface BrowserSupport {
  webgl: {
    supported: boolean;
    version: string | null;
    vendor: string | null;
    renderer: string | null;
  };
  webgl2: {
    supported: boolean;
    version: string | null;
    vendor: string | null;
    renderer: string | null;
  };
  webgpu: {
    supported: boolean;
    adapter: GPUAdapter | null;
    device: GPUDevice | null;
    features: string[];
    limits: Record<string, number>;
  };
}

class GraphicsAPIDetector {
  private results: BrowserSupport = {
    webgl: {
      supported: false,
      version: null,
      vendor: null,
      renderer: null,
    },
    webgl2: {
      supported: false,
      version: null,
      vendor: null,
      renderer: null,
    },
    webgpu: {
      supported: false,
      adapter: null,
      device: null,
      features: [],
      limits: {},
    },
  };

  // Detectar soporte WebGL 1.0
  private detectWebGL(): void {
    try {
      const canvas = document.createElement('canvas');
      const gl: WebGL2RenderingContext | WebGLRenderingContext = canvas.getContext('webgl') || canvas.getContext('webgl2') as WebGL2RenderingContext | WebGLRenderingContext;
      
      if (gl) {
        this.results.webgl.supported = true;
        this.results.webgl.version = gl.getParameter(gl.VERSION);
        this.results.webgl.vendor = gl.getParameter(gl.VENDOR);
        this.results.webgl.renderer = gl.getParameter(gl.RENDERER);
      }
    } catch (error) {
      console.warn('Error detecting WebGL:', error);
    }
  }

  // Detectar soporte WebGL 2.0
  private detectWebGL2(): void {
    try {
      const canvas = document.createElement('canvas');
      const gl2 = canvas.getContext('webgl2');
      
      if (gl2) {
        this.results.webgl2.supported = true;
        this.results.webgl2.version = gl2.getParameter(gl2.VERSION);
        this.results.webgl2.vendor = gl2.getParameter(gl2.VENDOR);
        this.results.webgl2.renderer = gl2.getParameter(gl2.RENDERER);
      }
    } catch (error) {
      console.warn('Error detecting WebGL2:', error);
    }
  }

  // Detectar soporte WebGPU
  private async detectWebGPU(): Promise<void> {
    try {
      if ('gpu' in navigator) {
        const adapter = await navigator.gpu.requestAdapter();
        
        if (adapter) {
          this.results.webgpu.supported = true;
          this.results.webgpu.adapter = adapter;
          
          // Obtener features soportadas
          this.results.webgpu.features = Array.from(adapter.features);
          
          // Obtener límites
          const limits = adapter.limits;
          this.results.webgpu.limits = {
            maxTextureDimension1D: limits.maxTextureDimension1D,
            maxTextureDimension2D: limits.maxTextureDimension2D,
            maxTextureDimension3D: limits.maxTextureDimension3D,
            maxTextureArrayLayers: limits.maxTextureArrayLayers,
            maxBindGroups: limits.maxBindGroups,
            maxDynamicUniformBuffersPerPipelineLayout: limits.maxDynamicUniformBuffersPerPipelineLayout,
            maxDynamicStorageBuffersPerPipelineLayout: limits.maxDynamicStorageBuffersPerPipelineLayout,
            maxSampledTexturesPerShaderStage: limits.maxSampledTexturesPerShaderStage,
            maxSamplersPerShaderStage: limits.maxSamplersPerShaderStage,
            maxStorageBuffersPerShaderStage: limits.maxStorageBuffersPerShaderStage,
            maxStorageTexturesPerShaderStage: limits.maxStorageTexturesPerShaderStage,
            maxUniformBuffersPerShaderStage: limits.maxUniformBuffersPerShaderStage,
            maxUniformBufferBindingSize: limits.maxUniformBufferBindingSize,
            maxStorageBufferBindingSize: limits.maxStorageBufferBindingSize,
            maxBufferSize: limits.maxBufferSize,
            maxVertexBuffers: limits.maxVertexBuffers,
            maxVertexAttributes: limits.maxVertexAttributes,
            maxVertexBufferArrayStride: limits.maxVertexBufferArrayStride,
            maxComputeWorkgroupStorageSize: limits.maxComputeWorkgroupStorageSize,
            maxComputeInvocationsPerWorkgroup: limits.maxComputeInvocationsPerWorkgroup,
            maxComputeWorkgroupSizeX: limits.maxComputeWorkgroupSizeX,
            maxComputeWorkgroupSizeY: limits.maxComputeWorkgroupSizeY,
            maxComputeWorkgroupSizeZ: limits.maxComputeWorkgroupSizeZ,
            maxComputeWorkgroupsPerDimension: limits.maxComputeWorkgroupsPerDimension,
          };

          // Intentar crear un device
          try {
            const device = await adapter.requestDevice();
            this.results.webgpu.device = device;
          } catch (deviceError) {
            console.warn('Could not create WebGPU device:', deviceError);
          }
        }
      }
    } catch (error) {
      console.warn('Error detecting WebGPU:', error);
    }
  }

  public async detect(): Promise<BrowserSupport> {
    this.detectWebGL();
    this.detectWebGL2();
    await this.detectWebGPU();
    
    return this.results;
  }

  public printResults(): void {
    console.group('🔍 Browser Graphics API Support');
    
    console.group('📊 WebGL 1.0');
    console.log('Supported:', this.results.webgl.supported ? '✅' : '❌');
    if (this.results.webgl.supported) {
      console.log('Version:', this.results.webgl.version);
      console.log('Vendor:', this.results.webgl.vendor);
      console.log('Renderer:', this.results.webgl.renderer);
    }
    console.groupEnd();

    console.group('📊 WebGL 2.0');
    console.log('Supported:', this.results.webgl2.supported ? '✅' : '❌');
    if (this.results.webgl2.supported) {
      console.log('Version:', this.results.webgl2.version);
      console.log('Vendor:', this.results.webgl2.vendor);
      console.log('Renderer:', this.results.webgl2.renderer);
    }
    console.groupEnd();

    console.group('🚀 WebGPU');
    console.log('Supported:', this.results.webgpu.supported ? '✅' : '❌');
    if (this.results.webgpu.supported) {
      console.log('Device created:', this.results.webgpu.device ? '✅' : '❌');
      console.log('Features:', this.results.webgpu.features);
      console.log('Key Limits:');
      console.log('  Max Texture 2D:', this.results.webgpu.limits.maxTextureDimension2D);
      console.log('  Max Buffer Size:', this.results.webgpu.limits.maxBufferSize);
      console.log('  Max Vertex Buffers:', this.results.webgpu.limits.maxVertexBuffers);
    }
    console.groupEnd();

    console.groupEnd();
  }

  public generateReport(): string {
    let report = '🔍 Browser Graphics API Support Report\n';
    report += '=====================================\n\n';

    report += '📊 WebGL 1.0\n';
    report += `Supported: ${this.results.webgl.supported ? '✅ Yes' : '❌ No'}\n`;
    if (this.results.webgl.supported) {
      report += `Version: ${this.results.webgl.version}\n`;
      report += `Vendor: ${this.results.webgl.vendor}\n`;
      report += `Renderer: ${this.results.webgl.renderer}\n`;
    }
    report += '\n';

    report += '📊 WebGL 2.0\n';
    report += `Supported: ${this.results.webgl2.supported ? '✅ Yes' : '❌ No'}\n`;
    if (this.results.webgl2.supported) {
      report += `Version: ${this.results.webgl2.version}\n`;
      report += `Vendor: ${this.results.webgl2.vendor}\n`;
      report += `Renderer: ${this.results.webgl2.renderer}\n`;
    }
    report += '\n';

    report += '🚀 WebGPU\n';
    report += `Supported: ${this.results.webgpu.supported ? '✅ Yes' : '❌ No'}\n`;
    if (this.results.webgpu.supported) {
      report += `Device created: ${this.results.webgpu.device ? '✅ Yes' : '❌ No'}\n`;
      report += `Features: ${this.results.webgpu.features.join(', ') || 'None'}\n`;
      report += `Max Texture 2D: ${this.results.webgpu.limits.maxTextureDimension2D}\n`;
      report += `Max Buffer Size: ${this.results.webgpu.limits.maxBufferSize}\n`;
    }

    return report;
  }

  // Obtener solo un resumen
  public getSummary(): { webgl: boolean; webgl2: boolean; webgpu: boolean } {
    return {
      webgl: this.results.webgl.supported,
      webgl2: this.results.webgl2.supported,
      webgpu: this.results.webgpu.supported,
    };
  }
}

async function checkGraphicsSupport(): Promise<void> {
  const detector = new GraphicsAPIDetector();
  
  console.log('🔍 Detecting graphics API support...');
  
  const results = await detector.detect();
  
  // Mostrar resultados en consola
  detector.printResults();
  
  // También puedes obtener un resumen simple
  const summary = detector.getSummary();
  console.log('\n📋 Quick Summary:', summary);
  
  // O generar un reporte en texto
  const report = detector.generateReport();
  console.log('\n📄 Text Report:\n', report);
}

checkGraphicsSupport().catch(console.error);

export { GraphicsAPIDetector, type BrowserSupport };