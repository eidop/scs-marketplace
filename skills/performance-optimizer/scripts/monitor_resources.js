
const os = require('os');
const { exec } = require('child_process');

async function monitorResources() {
    let report = [];

    // --- CPU Usage (Conceptual/Basic) ---
    // Getting precise CPU usage can be complex and platform-dependent.
    // Here's a simplified approach using os.cpus() or a shell command.
    try {
        // Using os.cpus() for overall CPU info, but not direct current usage % easily
        const cpus = os.cpus();
        const totalCpus = cpus.length;

        // On Linux/macOS, 'top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk '{print 100 - $1}'' might give % usage
        // On Windows, 'wmic cpu get loadpercentage' might work.

        // For simplicity, we'll report number of CPUs and a conceptual usage.
        report.push(`CPU Cores: ${totalCpus}`);

        // Attempt to get load average (more general system load, not per-core %)
        const loadAvg = os.loadavg();
        report.push(`Load Average (1m, 5m, 15m): ${loadAvg.map(l => l.toFixed(2)).join(', ')}`);

    } catch (cpuError) {
        report.push(`Error getting CPU info: ${cpuError.message}`);
    }

    // --- Memory Usage ---
    try {
        const totalMem = os.totalmem(); // in bytes
        const freeMem = os.freemem();   // in bytes
        const usedMem = totalMem - freeMem;

        const totalMemGB = (totalMem / (1024 ** 3)).toFixed(2);
        const freeMemGB = (freeMem / (1024 ** 3)).toFixed(2);
        const usedMemGB = (usedMem / (1024 ** 3)).toFixed(2);
        const usedPercent = ((usedMem / totalMem) * 100).toFixed(2);

        report.push(`Total Memory: ${totalMemGB} GB`);
        report.push(`Used Memory: ${usedMemGB} GB (${usedPercent}%)`);
        report.push(`Free Memory: ${freeMemGB} GB`);

    } catch (memError) {
        report.push(`Error getting Memory info: ${memError.message}`);
    }

    console.log("--- System Resource Report ---");
    console.log(report.join('\n'));
    console.log("------------------------------");

    return { success: true, report: report.join('\n') };
}

monitorResources();
