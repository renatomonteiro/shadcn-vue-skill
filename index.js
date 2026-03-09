#!/usr/bin/env node

'use strict';

const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const fs = require('fs');
const path = require('path');

const SKILL_DIR = __dirname;

const RESOURCES = [
  {
    name: 'shadcn-vue Skill',
    uri: 'shadcn-vue://skill',
    file: 'SKILL.md',
    description: 'Main skill entry point — expert guide for building Vue.js UIs with shadcn-vue',
    mimeType: 'text/markdown',
  },
  {
    name: 'Setup Guide',
    uri: 'shadcn-vue://references/setup',
    file: path.join('references', 'setup.md'),
    description: 'Vite + Vue 3 and Nuxt 3 installation and configuration guide',
    mimeType: 'text/markdown',
  },
  {
    name: 'Components Reference',
    uri: 'shadcn-vue://references/components',
    file: path.join('references', 'components.md'),
    description: 'Component examples and common UI patterns for shadcn-vue',
    mimeType: 'text/markdown',
  },
  {
    name: 'Theming Guide',
    uri: 'shadcn-vue://references/theming',
    file: path.join('references', 'theming.md'),
    description: 'CSS variables, OKLCH color tokens, and dark mode patterns',
    mimeType: 'text/markdown',
  },
  {
    name: 'Code Review Checklist',
    uri: 'shadcn-vue://references/review',
    file: path.join('references', 'review.md'),
    description: 'Structured checklist for reviewing and improving shadcn-vue code',
    mimeType: 'text/markdown',
  },
];

const server = new McpServer({
  name: 'shadcn-vue-skill',
  version: '1.0.0',
});

for (const resource of RESOURCES) {
  const filePath = path.join(SKILL_DIR, resource.file);
  server.registerResource(
    resource.name,
    resource.uri,
    {
      description: resource.description,
      mimeType: resource.mimeType,
    },
    async (uri) => {
      let text;
      try {
        text = await fs.promises.readFile(filePath, 'utf-8');
      } catch (err) {
        throw new Error(`Failed to read resource "${resource.name}" from ${filePath}: ${err.message}`);
      }
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: resource.mimeType,
            text,
          },
        ],
      };
    }
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exit(1);
});
