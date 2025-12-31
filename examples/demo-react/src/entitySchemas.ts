import type { EntityType } from "./types";

export interface EntitySchema {
    label: string;
    fields: { name: string; label: string }[];
    sampleData: Record<string, any>;
}

export const ENTITY_SCHEMAS: Record<EntityType, EntitySchema> = {
    employee: {
        label: "Employee",
        fields: [
            { name: "name", label: "Name" },
            { name: "employeeId", label: "Employee ID" },
            { name: "designation", label: "Designation" },
            { name: "place", label: "Place" },
        ],
        sampleData: {
            name: "John Doe",
            employeeId: "EMP001",
            designation: "Software Engineer",
            place: "Bangalore",
        },
    },
    vendor: {
        label: "Vendor",
        fields: [
            { name: "vendorName", label: "Vendor Name" },
            { name: "vendorCode", label: "Vendor Code" },
            { name: "contactPerson", label: "Contact Person" },
            { name: "category", label: "Category" },
        ],
        sampleData: {
            vendorName: "Acme Corp",
            vendorCode: "VND-1001",
            contactPerson: "Mike Ross",
            category: "Manufacturing",
        },
    },
    machine: {
        label: "Machine",
        fields: [
            { name: "machineName", label: "Machine Name" },
            { name: "machineId", label: "Machine ID" },
            { name: "model", label: "Model" },
            { name: "installationDate", label: "Installation Date" },
        ],
        sampleData: {
            machineName: "CNC Router",
            machineId: "MAC-05",
            model: "Dyna-400",
            installationDate: "2023-05-12",
        },
    },
};
