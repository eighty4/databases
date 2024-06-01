#!/bin/sh
set -e

pnpm check
pnpm build
pnpm dev -h
