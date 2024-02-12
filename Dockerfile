# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=20.6.0
ARG PNPM_VERSION=8.14.3

ARG PACKAGE_DIR=core
ARG PACKAGE=core
ARG PORT=3000

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Install python deps for node-gyp
RUN apk add g++ make py3-pip

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

################################################################################
# Create a stage for installing production dependecies.
FROM base as deps
ARG PACKAGE_DIR

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.local/share/pnpm/store to speed up subsequent builds.
# Leverage bind mounts to package.json and pnpm-lock.yaml to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-workspace.yaml,target=pnpm-workspace.yaml \
    --mount=type=bind,source=${PACKAGE_DIR}/package.json,target=${PACKAGE_DIR}/package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    --mount=type=cache,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile

################################################################################
# Create a stage for building the application.
FROM deps as build
ARG PACKAGE_DIR PACKAGE

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=${PACKAGE_DIR}/package.json,target=${PACKAGE_DIR}/package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN ./bin/render-build.sh ${PACKAGE}

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as shared
ARG PACKAGE_DIR PACKAGE PORT

# needed so that the CMD can use this var
ENV PACKAGE=$PACKAGE

# Use production node environment by default.
ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json \
     pnpm-workspace.yaml \
     .

COPY ./${PACKAGE_DIR}/package.json \
     ./${PACKAGE_DIR}/

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/${PACKAGE_DIR}/node_modules ./${PACKAGE_DIR}/node_modules

# Expose the port that the application listens on.
EXPOSE $PORT
# Run the application.
CMD pnpm --filter ${PACKAGE} start

# add an optional target to use for the jobs package only
FROM shared AS jobs
ARG PACKAGE_DIR
COPY --from=build /usr/src/app/${PACKAGE_DIR}/index.ts ./${PACKAGE_DIR}/index.ts

# But most packages are built in this standard next.js way.
FROM shared AS main
ARG PACKAGE_DIR
COPY --from=build /usr/src/app/${PACKAGE_DIR}/.next ./${PACKAGE_DIR}/.next
