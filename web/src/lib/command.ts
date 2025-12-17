import commandNode from "./commands.json";

type CommandNode = {
    type: "literal" | "argument" | string;
    name: string;
    executable: boolean;
    children: CommandNode[];
};

// Recursive function, node is optional for the first call
function getSuggestions(inputTokens: string[], node?: CommandNode): string[] {
    // Use root if node not provided
    const currentNode = node || (commandNode.root as CommandNode);

    if (inputTokens.length === 0) {
        // No more input: suggest all children literals
        return currentNode.children
            .filter(child => child.type === "literal")
            .map(child => child.name);
    }

    const [current, ...rest] = inputTokens;

    // Find matching child
    const child = currentNode.children.find(c => c.name === current);

    if (!child) {
        // No exact match: suggest matching literals
        return currentNode.children
            .filter(c => c.type === "literal" && c.name.startsWith(current))
            .map(c => c.name);
    }

    // Recurse deeper with the matching child
    return getSuggestions(rest, child);
}


export { getSuggestions };
