export const mockReport = {
    projectName: "Moduly-CLI",
    timestamp: new Date().toISOString(),
    score: 94,
    stats: {
        totalFiles: 42,
        totalLOC: 12450,
        totalCodeLines: 9800,
        totalCommentLines: 1150,
        totalBlankLines: 1500,
        languages: {
            ".ts": 28,
            ".tsx": 10,
            ".js": 4
        },
        fileList: [
            { path: "src/index.ts", size: 4500, extension: ".ts", linesOfCode: 120, loc: { totalLines: 150, codeLines: 120, commentLines: 10, blankLines: 20 } },
            { path: "src/analyzer/project.ts", size: 8200, extension: ".ts", linesOfCode: 240, loc: { totalLines: 300, codeLines: 240, commentLines: 25, blankLines: 35 } },
            { path: "src/dashboard/generator.ts", size: 12000, extension: ".ts", linesOfCode: 450, loc: { totalLines: 550, codeLines: 450, commentLines: 40, blankLines: 60 } },
        ]
    },
    hotspots: [
        { file: "src/analyzer/project.ts", commits: 24 },
        { file: "src/dashboard/generator.ts", commits: 18 },
        { file: "package.json", commits: 12 },
        { file: "src/index.ts", commits: 9 }
    ],
    dependencies: {
        nodes: [
            { id: "src/index.ts", type: "entry" },
            { id: "src/analyzer/project.ts", type: "logic" },
            { id: "src/analyzer/git.ts", type: "logic" },
            { id: "src/dashboard/generator.ts", type: "ui" },
            { id: "src/types.ts", type: "data" },
            { id: "src/commands/analyze.ts", type: "command" },
            { id: "src/commands/ai.ts", type: "command" }
        ],
        links: [
            { source: "src/index.ts", target: "src/commands/analyze.ts" },
            { source: "src/index.ts", target: "src/commands/ai.ts" },
            { source: "src/commands/analyze.ts", target: "src/analyzer/project.ts" },
            { source: "src/commands/analyze.ts", target: "src/dashboard/generator.ts" },
            { source: "src/analyzer/project.ts", target: "src/analyzer/git.ts" },
            { source: "src/analyzer/project.ts", target: "src/types.ts" },
            { source: "src/analyzer/git.ts", target: "src/types.ts" },
            { source: "src/dashboard/generator.ts", target: "src/types.ts" }
        ]
    },
    packageDependencies: {
        dependencies: {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "framer-motion": "^10.0.0",
            "lucide-react": "^0.300.0",
            "recharts": "^2.10.0",
            "lodash": "^4.17.21"
        },
        devDependencies: {
            "typescript": "^5.0.0",
            "eslint": "^8.0.0"
        },
        used: ["react", "react-dom", "framer-motion", "lucide-react", "recharts"],
        unused: ["lodash"],
        outdated: [
            { name: "framer-motion", current: "10.0.0", latest: "11.0.0" }
        ],
        suggestions: ["tailwind-merge - Merge Tailwind classes efficiently", "clsx - Conditional class name utility"]
    },
    security: [
        { name: "Regular Expression Denial of Service (ReDoS)", severity: "low", description: "Found in minimatch < 3.0.5", source: "npm-audit", category: "Dependency Vulnerability" },
        { name: "Cross-Site Scripting (XSS)", severity: "medium", description: "Ensure user inputs are sanitized in UI components", source: "code-scan", file: "src/components/UserInput.tsx", line: 42, category: "Cross-Site Scripting (XSS)" }
    ],
    performance: {
        bundleSize: "1.2MB",
        sourceSize: "850KB",
        loadTime: "1.4s",
        dependencyCount: 8,
        largeFiles: [
            { path: "src/dashboard/generator.ts", size: "12.0KB", lines: 550 }
        ],
        heavyDependencies: [
            { name: "lodash", reason: "lodash is ~70KB. Use lodash-es for tree-shaking or import individual functions (lodash/get)." }
        ]
    }
};
