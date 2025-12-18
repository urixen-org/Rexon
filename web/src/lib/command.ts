import commandNode from "./commands.json";

type CommandNode = {
    type: "literal" | "argument" | string;
    name: string;
    executable: boolean;
    children: CommandNode[];
};

function getSuggestions(inputTokens: string[], node?: CommandNode): string[] {
  
    const currentNode = node || (commandNode.root as CommandNode);

    if (inputTokens.length === 0) {
        return currentNode.children
            .filter(child => child.type === "literal")
            .map(child => child.name);
    }

    const [current, ...rest] = inputTokens;

    const child = currentNode.children.find(c => c.name === current);

    if (!child) {
        return currentNode.children
            .filter(c => c.type === "literal" && c.name.startsWith(current))
            .map(c => c.name);
    }

    return getSuggestions(rest, child);
}


export { getSuggestions };
