export function makeEnvironmentCaptor(aGlobal: object, dropNames?: boolean): Readonly<{
    getEnvironmentOption: (optionName: string, defaultSetting: string, optOtherValues?: string[]) => string;
    getEnvironmentOptionsList: <T extends string = string>(optionName: string) => T[];
    environmentOptionsListHas: <T extends string = string>(optionName: string, element: T) => boolean;
    getCapturedEnvironmentOptionNames: () => readonly string[];
}>;
/**
 * Gets an environment option by name and returns the option value or the
 * given default.
 *
 * @param {string} optionName
 * @param {string} defaultSetting
 * @param {string[]} [optOtherValues]
 * If provided, the option value must be included or match `defaultSetting`.
 * @returns {string}
 */
export function getEnvironmentOption(optionName: string, defaultSetting: string, optOtherValues?: string[]): string;
/**
 * @template {string} [T=string]
 * @param {string} optionName
 * @returns {T[]}
 */
export function getEnvironmentOptionsList<T extends string = string>(optionName: string): T[];
/**
 * @template {string} [T=string]
 * @param {string} optionName
 * @param {T} element
 * @returns {boolean}
 */
export function environmentOptionsListHas<T extends string = string>(optionName: string, element: T): boolean;
//# sourceMappingURL=env-options.d.ts.map