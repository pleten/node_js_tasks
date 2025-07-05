// ----- A. Zod-registry + upload.yaml ---------------------------------
import { registry } from '../openapi/registry.js';
import { OpenApiGeneratorV3} from '@asteasolutions/zod-to-openapi';

import { config } from '../config/index.js';

export const createZodSpec = () => {

  const zodSpec = new OpenApiGeneratorV3(registry.definitions).generateDocument({
    info: {
      title: config.appName,
      version: config.appVersion
    }
  });

// додаємо шлях /upload
  zodSpec.paths = { ...zodSpec.paths };
  zodSpec.components = {
    ...zodSpec.components,
    schemas: {
      ...zodSpec.components.schemas,
    }
  };

  return zodSpec;
};
