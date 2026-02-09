
const { Linkinator } = require('linkinator');

async function checkBrokenLinks(url) {
    console.log(`Checking for broken links on: ${url}`);
    const checker = new Linkinator({
        // Options for Linkinator
        // See: https://www.npmjs.com/package/linkinator
        href: true, // Check href attributes
        links: true, // Check <a> tags
        recursive: true, // Follow internal links
        timeout: 10000, // 10 seconds timeout for each request
        concurrency: 10, // Number of concurrent requests
        skip: [
            'https://twitter.com/*', // Skip Twitter links often rate-limited
            'https://linkedin.com/*', // Skip LinkedIn
            'https://github.com/*', // Skip GitHub
            'https://widget.intercom.io/*' // Skip Intercom widget
        ]
    });

    const result = await checker.check({ path: url });

    if (result.brokenLinks.length > 0) {
        console.log(`Broken links found on ${url}:`);
        result.brokenLinks.forEach(link => {
            console.log(`- [${link.state}] ${link.url} (Parent: ${link.parent})`);
        });
        return { success: false, brokenLinks: result.brokenLinks, message: `Found ${result.brokenLinks.length} broken links.` };
    } else {
        console.log(`No broken links found on ${url}. Website appears healthy.`);
        return { success: true, message: 'No broken links found.' };
    }
}

// Example usage for command line
const args = process.argv.slice(2);
if (args.length > 0) {
    checkBrokenLinks(args[0]);
} else {
    console.log("Usage: node check_links.js <URL_TO_CHECK>");
    console.log("Example: node check_links.js https://scs-marketplace.pages.dev/");
}
