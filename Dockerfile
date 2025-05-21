FROM node:20 AS frontend
WORKDIR /frontend
COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn
COPY ./license.md ../
COPY ./frontend/ ./
RUN yarn build

FROM python:3.13.2 AS backend
WORKDIR /backend
RUN pip install uv
COPY ./backend/ ./
RUN mkdir -p /backend/database
RUN uv venv
RUN uv pip install .
COPY --from=frontend /frontend/dist ./dist

VOLUME ["/backend/database"]
EXPOSE 80
CMD ["uv", "run", "dev.py", "80"]
