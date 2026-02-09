
const si = require('systeminformation');

async function monitorResources() {
    let report = [];
    let metrics = {};

    report.push("--- System Resource Report ---");

    try {
        const cpu = await si.currentLoad();
        metrics.cpu = {
            currentLoad: cpu.currentLoad.toFixed(2),
            avgLoad: cpu.avgLoad.toFixed(2),
        };
        report.push(`CPU Usage: ${metrics.cpu.currentLoad}% (Avg: ${metrics.cpu.avgLoad}%)`);
    } catch (e) {
        report.push(`Error getting CPU info: ${e.message}`);
    }

    try {
        const mem = await si.mem();
        metrics.memory = {
            total: (mem.total / (1024 ** 3)).toFixed(2),
            used: (mem.used / (1024 ** 3)).toFixed(2),
            free: (mem.free / (1024 ** 3)).toFixed(2),
            usedPercent: ((mem.used / mem.total) * 100).toFixed(2),
        };
        report.push(`Total Memory: ${metrics.memory.total} GB`);
        report.push(`Used Memory: ${metrics.memory.used} GB (${metrics.memory.usedPercent}%)`);
        report.push(`Free Memory: ${metrics.memory.free} GB`);
    } catch (e) {
        report.push(`Error getting Memory info: ${e.message}`);
    }

    try {
        const disks = await si.fsSize();
        metrics.disk = disks.map(disk => ({
            mount: disk.mount,
            size: (disk.size / (1024 ** 3)).toFixed(2),
            used: (disk.used / (1024 ** 3)).toFixed(2),
            usedPercent: disk.use.toFixed(2),
        }));
        metrics.disk.forEach(disk => {
            report.push(`Disk (${disk.mount}): Total ${disk.size} GB, Used ${disk.used} GB (${disk.usedPercent}%)`);
        });
    } catch (e) {
        report.push(`Error getting Disk info: ${e.message}`);
    }

    try {
        const network = await si.networkStats();
        metrics.network = network.map(net => ({
            iface: net.iface,
            rx_sec: (net.rx_sec / (1024 ** 2)).toFixed(2),
            tx_sec: (net.tx_sec / (1024 ** 2)).toFixed(2),
        }));
        metrics.network.forEach(net => {
            report.push(`Network (${net.iface}): Rx ${net.rx_sec} MB/s, Tx ${net.tx_sec} MB/s`);
        });
    } catch (e) {
        report.push(`Error getting Network info: ${e.message}`);
    }

    report.push("------------------------------");

    console.log(report.join('\n'));

    return { success: true, report: report.join('\n'), metrics };
}

monitorResources();
