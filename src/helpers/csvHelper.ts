import type { FragranceData } from "../types/FragranceTypes";

export const parseCSV = (csv: string): FragranceData[] => {
    const [headerLine, ...lines] = csv.trim().split("\n");
    const headers = headerLine.split(",");
    return lines.map(line => {
        const values = line.split(",");
        const row: FragranceData = {};
        headers.forEach((header, i) => {
            row[header.trim()] = values[i]?.trim() ?? "";
        });
        return row;
    });
};