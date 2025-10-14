import { type Mock } from "@forsakringskassan/apimock-express";

export interface SelectOption {
    title: string;
    value: unknown;
}

export interface SelectSettings {
    type?: "select";
    key: string;
    title: string;
    reloadOnChange?: boolean;
    execOnChange?: string;
    description?: string;
    sessionStorage?: boolean;
    options: SelectOption[];
}

export interface LinkOption {
    title: string;
    href: string;
}

export interface LinkSettings {
    type: "links";
    title: string;
    description?: string;
    options: LinkOption[];
}

export type Settings = SelectSettings | LinkSettings;

export default function devindexMenu(
    userSettingsAndMocks: Array<Settings | Mock>,
): void;
