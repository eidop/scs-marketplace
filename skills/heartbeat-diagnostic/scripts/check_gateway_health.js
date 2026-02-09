
const { default_api } = require('./openclaw_api'); // Assuming openclaw_api is available or injected

async function checkGatewayHealth() {
    try {
        const status = await default_api.gateway({ action: "status" });

        if (status.ok) {
            console.log("Gateway Status: OK");
            return { success: true, message: "Gateway is running." };
        } else {
            console.error("Gateway Status: DOWN or Error");
            console.error("Details:", status.error || "Unknown error");
            return { success: false, message: status.error || "Gateway is not running or unreachable." };
        }
    } catch (error) {
        console.error("Error checking Gateway status:", error.message);
        return { success: false, message: `Error checking Gateway status: ${error.message}` };
    }
}

// For direct execution via Node.js
if (require.main === module) {
    checkGatewayHealth().then(result => {
        // Output a simple indicator for cron job to parse
        if (result.success) {
            console.log("HEALTH_OK");
        } else {
            console.error("HEALTH_DOWN");
        }
    });
}
