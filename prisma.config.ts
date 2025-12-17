import { defineConfig } from '@prisma/config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing from environment variables');
}

export default defineConfig({
    schema: 'backend/prisma/schema.prisma',
    datasource: {
        url: databaseUrl,
    }
});
