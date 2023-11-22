import type { GetStaticPaths } from "astro";

export function parseFilesToSampleRoutes(files: Record<string, any>) {
  const routes: ReturnType<GetStaticPaths> = [];

  for (const [key, value] of Object.entries(files)) {
    if (key.endsWith(".svelte")) continue;

    const cleanedKey = key.replace("../../../../packs/", "");
    const sample = cleanedKey.split("/")[1];

    routes.push({
      params: {
        sample,
      },
      props: {
        react: value,
        svelte: files[key.replace("tsx", "svelte")],
      },
    });
  }

  // main route: /multiverse/pack
  routes.push({ params: { sample: undefined } });

  return routes;
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
