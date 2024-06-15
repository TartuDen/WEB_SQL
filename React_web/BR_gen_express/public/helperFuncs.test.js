function populateContent(content, localMemory) {
    console.log("content:..........\n",content);
    console.log("localMem.......\n",localMemory);

    const { equipmentSet } = localMemory;
    const equipmentMap = new Map();

    // Populate equipmentMap with equipment names as keys and array of codes as values
    equipmentSet.forEach(item => {
        const { name, code } = item;
        // const nameWithoutIndex = name.slice(0, -3); // Remove last 3 characters
        let nameWithoutIndex;
        let idIndex = name.indexOf("id");
        if (idIndex !== -1) { // Check if "id" exists in the string
            nameWithoutIndex = name.slice(0, idIndex); // Slice the string from the beginning to the index of "id"
        }

        if (!equipmentMap.has(nameWithoutIndex)) {
            equipmentMap.set(nameWithoutIndex, []);
        }
        equipmentMap.get(nameWithoutIndex).push(code);
    });

    // Regular expression to match placeholders inside curly braces {}
    const placeholderRegex = /{([^{}]*)}/g;

    // Replace placeholders in the content
    const populatedContent = content.replace(placeholderRegex, (match, p1) => {
        // Check if the placeholder matches an equipment name in localMemory
        if (equipmentMap.has(p1)) {
            // If there's a matching equipment name, create a select element with options
            const options = equipmentMap.get(p1).map(code => `<option value="${code}">${code}</option>`).join('');
            return `<select name="${p1}">${options}</select>`;
        } else {
            // If there's no matching equipment name, keep the placeholder unchanged
            return match;
        }
    });

    return populatedContent;
}

describe('populateContent', () => {
    it('should replace placeholders with select elements populated with codes', () => {
        const content = "Please select your equipment: {machine} and {tool}";
        const localMemory = {
            equipmentSet: [
                { name: "machineid123", code: "M123" },
                { name: "machineid124", code: "M124" },
                { name: "toolid125", code: "T125" },
                { name: "toolid126", code: "T126" }
            ]
        };

        const expectedOutput = `Please select your equipment: <select name="machine"><option value="M123">M123</option><option value="M124">M124</option></select> and <select name="tool"><option value="T125">T125</option><option value="T126">T126</option></select>`;

        const result = populateContent(content, localMemory);

        expect(result).toBe(expectedOutput);
    });

    it('should keep placeholders unchanged if no matching equipment name is found', () => {
        const content = "Select: {nonexistent}";
        const localMemory = {
            equipmentSet: [
                { name: "machineid123", code: "M123" }
            ]
        };

        const expectedOutput = "Select: {nonexistent}";

        const result = populateContent(content, localMemory);

        expect(result).toBe(expectedOutput);
    });

    it('should handle multiple placeholders for the same equipment name', () => {
        const content = "Select one: {machine}, select again: {machine}";
        const localMemory = {
            equipmentSet: [
                { name: "machineid123", code: "M123" },
                { name: "machineid124", code: "M124" }
            ]
        };

        const expectedOutput = `Select one: <select name="machine"><option value="M123">M123</option><option value="M124">M124</option></select>, select again: <select name="machine"><option value="M123">M123</option><option value="M124">M124</option></select>`;

        const result = populateContent(content, localMemory);

        expect(result).toBe(expectedOutput);
    });
});
