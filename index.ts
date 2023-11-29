---
import type { GetStaticPaths } from "astro";
import MultiverseFlow from "@flows/Multiverse";

export async function getStaticPaths() {
    const parseFilesToRoutes = (files: Record<string, any>) => {
        const routes : ReturnType<GetStaticPaths> = [];
        const frameworkEndings = {
            'tsx': 'react',
            'svelte': 'svelte',
        };

        for (const [key, value] of Object.entries(files)) {
            const cleanedKey = key.replace('../../../../packs/', '');
            const [pack, sample] = cleanedKey.split('/');

            routes.push({
                params: {
                    pack,
                    // FIXME: A little flakey, but works for now
                    sample: sample.includes('.ts') ? undefined : sample,
                },
                props: {
                    flowConfig: files[`../../../../packs/${pack}/flow.react.ts`]
                },
            })
        }

        return routes;
    }

    // Only match react files
    const files = import.meta.glob(['../../../../packs/**/*', '!**/*.svelte', '!**/*.svelte.ts'], { eager: true, import: 'default'} );
    return parseFilesToRoutes(files);
}
---

<script>
    const files = import.meta.glob(['../../../../packs/**/*', '!**/*.svelte', '!**/.ts'], { eager: true, import: 'default'} );
</script>

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<style>
			html,
			body {
				font-family: system-ui;
				margin: 0;
                width: 100%;
                height: 100%;
			}

            nav {
                widht: 100%;
                height: 64px;
                background: white;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                border-bottom: 1px solid #EEE;
            }

            .logo {
                height: 36px;
                margin-left: 32px;
                margin-right: 15px;
            }

            .title {
                display: flex;
                align-items: center;
                margin-right: auto;
            }

            .placeholder {
                width: 60px;
                height: 14px;
                background: #DDD;
                margin: 0 9px;
            }

            .search {
                background: rgb(243, 244, 246);
                height: 36px;
                width: 140px;
                border-radius: 36px;
                margin: 0 9px;
            }

            .pro {
                background: rgba(255, 0, 115, 0.808);
                height: 36px;
                width: 140px;
                border-radius: 36px;
                margin: 0 9px;
            }
		</style>
	</head>
	<body>
        <nav>
            <div class="title">
                <img src="/react-flow-logo.svg" class="logo"/>
                <h1>React Flow</h1>
            </div>
            <div class="placeholder"/>
            <div class="placeholder"/>
            <div class="placeholder"/>
            <div class="placeholder"/>
            <div class="search" />
            <div class="pro" />
        </nav>
        <MultiverseFlow flowConfig={Astro.props.flowConfig} client:load/>
	</body>
</html>
