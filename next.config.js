/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        domains: ['avatars.githubusercontent.com'],
        // You can add more domains if needed:
        // domains: ['avatars.githubusercontent.com', 'example.com'],
      },
};

export default config;
