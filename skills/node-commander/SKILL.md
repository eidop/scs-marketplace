---
name: node-commander
description: Manages and controls paired OpenClaw Nodes. Use to remotely access node hardware (camera, screen, location), execute commands, send notifications, and leverage device-specific capabilities for remote operations and data gathering.
---

# Node Commander Skill

This skill provides comprehensive control over your paired OpenClaw Nodes, enabling direct interaction with their physical and software capabilities.

## Core Functionality

- **Node Discovery & Listing:** Identify and list all currently paired nodes.
- **Hardware Interaction:** Remotely trigger actions on node hardware:
    - `camera_snap`: Capture a photo from a node's camera.
    - `screen_record`: Record the screen of a node.
    - `location_get`: Retrieve the geographical location of a node.
- **Command Execution:** Run arbitrary commands on a node's operating system (`nodes.run`).
- **Notification System:** Send system notifications or overlays to a node's display (`nodes.notify`).
- **Device-Specific Capabilities:** Leverage other node-specific features like audio recording or sensor data.

## Usage Examples

- "List all my paired OpenClaw nodes."
- "Take a snapshot from the 'Living Room' node's camera."
- "Record the screen of the 'Workstation' node for 30 seconds."
- "Send a notification to the 'Kitchen' node: 'Coffee is ready!'"
- "Run `ls -la` on the 'Server' node."

## Resources

- `scripts/`: Placeholder for scripts to manage node connections, parse node capabilities, and execute complex multi-step node interactions.
- `references/`: Placeholder for documentation on specific node commands, API details, and common remote operation patterns.
