<script lang="ts">
  import SvelteFlow from "@flows/SvelteFlow.svelte";

  const flowConfig: SvelteFlowConfig = {
    flowProps: {
      nodes: [
        { id: "1", data: { label: "Node 1" }, position: { x: 250, y: 5 } },
      ],
      fitView: true,
    },
    backgroundProps: {},
  };
</script>

<SvelteFlow {flowConfig} />
