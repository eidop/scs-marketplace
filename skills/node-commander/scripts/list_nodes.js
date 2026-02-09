
// This script directly calls the OpenClaw `nodes` tool to list all connected nodes.

async function listOpenClawNodes() {
    try {
        // The `nodes` tool is available directly in the OpenClaw agent environment.
        const nodesStatus = await default_api.nodes(action="status");

        if (nodesStatus.error) {
            console.error("Error listing nodes:", nodesStatus.error);
            return { success: false, error: nodesStatus.error };
        }

        const nodeOutput = nodesStatus.nodes || nodesStatus.output; // Adjust based on actual tool output

        if (nodeOutput && nodeOutput.length > 0) {
            console.log("--- Connected OpenClaw Nodes ---");
            nodeOutput.forEach(node => {
                console.log(`- ID: ${node.id}, Name: ${node.name || 'N/A'}, Status: ${node.status || 'Unknown'}`);
                if (node.deviceInfo) {
                    console.log(`  Type: ${node.deviceInfo.os || 'N/A'}, Model: ${node.deviceInfo.model || 'N/A'}`);
                }
            });
            console.log("--------------------------------");
            return { success: true, nodes: nodeOutput };
        } else {
            console.log("No OpenClaw Nodes currently connected.");
            return { success: true, nodes: [] };
        }
    } catch (error) {
        console.error("Unhandled error in listOpenClawNodes:", error.message);
        return { success: false, error: error.message };
    }
}

listOpenClawNodes();
