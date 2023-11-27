import type { GetStaticPaths } from "astro";

export type Sample = {
  react: string;
  svelte?: string;
};

export function parseFilesToSamples(files: Record<string, any>) {
  const samples: Record<string, Sample> = {};

  for (const [key, value] of Object.entries(files)) {
    if (key.endsWith(".svelte")) continue;

    const cleanedKey = key.replace("../../../../packs/", "");
    const sample = cleanedKey.split("/")[1];

    samples[sample] = {
      react: value,
      svelte: files[key.replace("tsx", "svelte")],
    };
  }
  return samples;
}

export function parseFilesToRoutes(files: Record<string, string>) {
  const routes: ReturnType<GetStaticPaths> = [];

  for (const [key, value] of Object.entries(files)) {
    const cleanedKey = key.replace("../../../packs/", "");
    const [pack, filename] = cleanedKey.split("/");

    const fileEnding = filename.split(".")[1];
    const framework = fileEndings[fileEnding];
    const flowConfig = files[`../../../packs/${pack}/flow.${framework}.ts`];

    routes.push({
      params: {
        framework,
        pack,
      },
      props: {
        flowConfig,
      },
    });
  }
  return routes;
}

export const fileEndings: Record<string, string> = {
  tsx: "react",
  svelte: "svelte",
};
