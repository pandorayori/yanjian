#!/bin/bash
set -e

echo "Starting Next.js on port 9000..."

# 直接用 node 调用 next 的启动脚本
node node_modules/next/dist/bin/next start -p 9000