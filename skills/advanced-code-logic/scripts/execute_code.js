
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const vm = require('vm'); // For JavaScript sandboxing

async function executeCode(codeString, language = 'javascript') {
    const tempDir = path.join(__dirname, 'temp_code_exec');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    let fileName;
    let interpreter;
    let cleanupCommand;

    // Timeout for sandboxed JavaScript execution
    const sandboxTimeout = 5000; // 5 seconds

    let result = { success: false, output: '', error: '' };

    try {
        switch (language.toLowerCase()) {
            case 'javascript':
            case 'js':
                console.log(`Executing JavaScript code in a sandbox...`);
                const sandbox = {
                    console: {
                        log: (...args) => result.output += args.join(' ') + '\n',
                        error: (...args) => result.output += 'Error: ' + args.join(' ') + '\n'
                    },
                    setTimeout,
                    clearTimeout,
                    setInterval,
                    clearInterval,
                    // Only expose safe globals. No 'require', 'process', 'fs' etc.
                };
                const script = new vm.Script(codeString);
                try {
                    script.runInNewContext(sandbox, { timeout: sandboxTimeout });
                    result.success = true;
                    console.log(`Sandbox execution complete. Output:\n${result.output}`);
                } catch (e) {
                    result.error = `Sandbox execution failed: ${e.message}`;
                    result.output += `Error: ${e.message}\n`;
                    console.error(result.error);
                }
                break;
            case 'python':
            case 'py':
                fileName = path.join(tempDir, `script_${Date.now()}.py`);
                interpreter = 'python';
                fs.writeFileSync(fileName, codeString);
                console.log(`Executing Python code from ${fileName} (no sandbox)...`);

                await new Promise((resolve) => {
                    exec(`${interpreter} ${fileName}`, { cwd: tempDir, timeout: 10000 }, (error, stdout, stderr) => {
                        if (stdout) result.output += stdout.trim() + '\n';
                        if (stderr) result.output += `(Stderr): ${stderr.trim()}\n`;
                        if (error) result.error = error.message;
                        result.success = !error;
                        resolve();
                    });
                });
                console.log(`Python execution complete. Output:\n${result.output}`);
                if (result.error) console.error(`Python execution error: ${result.error}`);
                break;
            case 'bash':
            case 'sh':
                // WARNING: Bash execution is inherently less secure without advanced sandboxing.
                // This implementation is for basic script execution. Use with caution.
                fileName = path.join(tempDir, `script_${Date.now()}.sh`);
                interpreter = 'bash'; // Note: 'bash' might require WSL on Windows
                fs.writeFileSync(fileName, codeString);
                console.log(`Executing Bash script from ${fileName} (no sandbox)...`);

                await new Promise((resolve) => {
                    exec(`${interpreter} ${fileName}`, { cwd: tempDir, timeout: 10000 }, (error, stdout, stderr) => {
                        if (stdout) result.output += stdout.trim() + '\n';
                        if (stderr) result.output += `(Stderr): ${stderr.trim()}\n`;
                        if (error) result.error = error.message;
                        result.success = !error;
                        resolve();
                    });
                });
                console.log(`Bash execution complete. Output:\n${result.output}`);
                if (result.error) console.error(`Bash execution error: ${result.error}`);
                break;
            default:
                result.error = `Unsupported language: ${language}`;
                console.error(result.error);
        }

        return result;

    } catch (error) {
        console.error(`Failed to prepare/execute code: ${error.message}`);
        return { success: false, error: error.message };
    } finally {
        // Clean up temporary file for Python/Bash
        try {
            if (fileName && fs.existsSync(fileName)) {
                fs.unlinkSync(fileName);
                console.log(`Cleaned up temporary file: ${fileName}`);
            }
        } catch (cleanupError) {
            console.error(`Error during cleanup: ${cleanupError.message}`);
        }
        // NOTE: tempDir is not removed automatically to avoid potential issues if not empty.
    }
}

// Example usage (for conceptual demonstration):
// executeCode('console.log("Hello from JS!")', 'javascript');
// executeCode('print("Hello from Python!")', 'python');

// To make this executable, arguments can be parsed from process.argv
const args = process.argv.slice(2);
if (args.length >= 2) {
    executeCode(args[0], args[1]).then(res => console.log(JSON.stringify(res)));
} else if (args.length > 0) {
    console.log("Usage: node execute_code.js <codeString> <language>");
    console.log("Example: node execute_code.js \"console.log('Hello')\" javascript");
}
