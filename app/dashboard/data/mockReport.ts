export const mockReport = {
    projectName: "Moduly-CLI",
    timestamp: new Date().toISOString(),
    score: 94,
    stats: {
        totalFiles: 42,
        totalLOC: 12450,
        languages: {
            ".ts": 28,
            ".tsx": 10,
            ".js": 4
        },
        fileList: [
            { path: "src/index.ts", size: 4500, extension: ".ts", linesOfCode: 120 },
            { path: "src_ts/analyzer/project.ts", size: 8200, extension: ".ts", linesOfCode: 240 },
            { path: "src_ts/dashboard/generator.ts", size: 12000, extension: ".ts", linesOfCode: 450 },
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
    }
};
