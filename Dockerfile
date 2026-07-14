# Multi-stage: Vite frontend build, then Express + Socket.IO as non-root.
FROM node:18-alpine AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS runtime
RUN adduser -D -u 1000 appuser
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY --chown=appuser:appuser backend ./backend
COPY --from=frontend --chown=appuser:appuser /frontend/build ./frontend/build

USER appuser

ENV NODE_ENV=production \
    PORT=8000

EXPOSE 8000

CMD ["node", "backend/bin/www"]
