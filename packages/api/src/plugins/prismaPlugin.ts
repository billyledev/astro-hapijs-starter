import { PrismaClient } from '@prisma/client';

import type Hapi from '@hapi/hapi';

declare module '@hapi/hapi' {
  interface ServerApplicationState {
    prisma: PrismaClient;
  }
}

interface PrismaPluginData {
  name: string;
  version: string;
}

const internals: PrismaPluginData = {
  name: 'app/prisma',
  version: '1.0.0',
};

const prismaPlugin = {
  name: internals.name,
  version: internals.version,
  register: async (server: Hapi.Server) => {
    const prisma = new PrismaClient();

    server.app.prisma = prisma;

    server.ext({
      type: 'onPostStop',
      method: async (s: Hapi.Server) => {
        await s.app.prisma.$disconnect();
      },
    });
  },
};

export {
  internals as PrismaPluginInfos,
};

export default prismaPlugin;
