import { Items, Locations, Skulls, All } from "./OoTData";

const autocompleteArr = makeOoTObjectArray(All);
const locationsArr = makeOoTObjectArray(Locations);
const itemsArr = makeOoTObjectArray(Items);

export interface OoTObject {
    name: string;
    shorthand: string[];
}

export enum NoteType {
    ItemLocation,
    LocationGood, // Way of the Hero, Hero's Path
    LocationBad, // Barren
    Skull,
    None, // Used for autcomplete in InputBox
    BarrenItem
}

export interface NoteOutput {
    place?: string;
    item?: string;
    check: string;
    type: NoteType;
    count: number;
    deletion: boolean;
    notes?: string;
}

/**
 * Check if two NoteOutput objects are equal.
 * Does not check all properties.
 * That level of equality is not necessary when used in this program.
 * @param one NoteOutput one.
 * @param two NoteOutput two.
 * @returns "true" if objects match, "false" if not.
 */
export function checkNoteEquality(one: NoteOutput, two: NoteOutput): boolean {
    return one.check === two.check && one.item === two.item && one.place === two.place && one.type === two.type;
}

/**
 * Check if a NoteOutput object exists in the provided array.
 * Uses simplified equality checking in "checkNoteEquality".
 * @param input NoteOutput input.
 * @param arr Array to match against.
 * @returns Index of the provided NoteOutput object, -1 if not found.
 */
export function checkNoteExists(input: NoteOutput, arr: NoteOutput[]): number {
    for (const noteIndex in arr) {
        const value = arr[noteIndex];
        if (checkNoteEquality(input, value))
            return arr.indexOf(value);
    }
    return -1;
}


/**
 * Converts the objects in the OoTData.ts file to an OoTObject array.
 * @param data Object in OoTData.ts
 * @returns Resulting OoTObject array.
 */
function makeOoTObjectArray(data: any): OoTObject[] {
    let output: OoTObject[] = [];
    let key: keyof typeof data;
    for (key in data) {
        const value = data[key];
        output.push({
            name: key,
            shorthand: value['shorthand']
        });
    }
    return output;
}

/**
 * Sorts NoteOutput array alphabetically by check.
 * @param data Provided NoteOutput array.
 * @returns Sorted NoteOutput array.
 */
export function sortNoteOutputArray(data: NoteOutput[]): NoteOutput[] {
    return data.sort((a, b) => a.check.localeCompare(b.check));
}

/**
 * Return an OoTObject from the provided array that corresponds to something in the input.
 * @param input The string to check for matches.
 * @param arr Provided array to search through when looking.
 * @param sortby_first Whether to return the first or last value that could be matched.
 * @returns OotObject if something could be found, null if not.
 */
function checkStringLocation(input: string, arr: OoTObject[], sortby_first: boolean): OoTObject | null {
    let i: number;
    if (sortby_first)
        i = Number.MAX_VALUE;
    else
        i = -1;

    let value: OoTObject | null = null;
    for (const key in arr) {
        const valueTmp = arr[key];
        const lookup: number = input.toLowerCase().indexOf(valueTmp.name.toLowerCase())
        if (lookup !== -1) {
            if (sortby_first && lookup < i) {
                value = valueTmp;
                i = lookup;
            }
            else if (!sortby_first && lookup > i) {
                value = valueTmp;
                i = lookup;
            }
        }
    }
    return value;
}

/**
 * Creates a RegExp object for word matching the provided input.
 * @param input String to Regex match.
 * @returns RegExp class with \b surrounding the input, including case insensitivity.
 */
function regexWordMatch(input: string): RegExp {
    return new RegExp(`\\b${input}\\b`, "gi");
}

/**
 * Returns string formatting to prevent accidental regex matching.
 * Gets overwritten before being displayed to the user.
 * @param input String to handle formatting replacement.
 * @param obj OoTObject to perform name resolution.
 * @returns The formatted string.
 */
function stringFormattingReplace(input: string, obj: OoTObject): string {
    let tempName = obj.name.replaceAll(" ", "111");
    return input.replaceAll(regexWordMatch(obj.name), `000${tempName}000`);
}

/**
 * Resolves the shorthand values present in the string into their proper names.
 * @param input String used for replacement.
 * @param arr Provided OoTObject array to resolve names from.
 * @returns The replaced string.
 */
function resolveString(input: string, arr: OoTObject[] = autocompleteArr): string {
    let output = input;
    for (const key in arr) {
        const value = arr[key];
        let outputTmp = output;
        // First regex match the standard name, just in case the user types it out.
        output = output.replaceAll(regexWordMatch(value.name), value.name);
        // Check for if it directly matches; If capitalization is exactly the same technically output and outputTmp would be the same.
        if (output !== outputTmp || output === value.name) {
            output = stringFormattingReplace(output, value);
            outputTmp = output;
        }
        // Start looping through shorthand valuees, go through them all and replace, also check for changes while doing so.
        for (const shorthandKey in value.shorthand) {
            const shorthandValue = value.shorthand[shorthandKey];
            output = output.replaceAll(regexWordMatch(shorthandValue), value.name);
            if (output !== outputTmp) {
                output = stringFormattingReplace(output, value);
                outputTmp = output;
            }
        }
        // Last but not least, do a final check around just in case.
        if (output !== outputTmp) output = stringFormattingReplace(output, value);
    }
    // Clean up stupid formatting before returning the output.
    output = output.replaceAll("000", "");
    output = output.replaceAll("111", " ");
    return output;
}

/**
 * Takes NoteOutput values and returns the proper NoteType.
 * @param itemName Name of the NoteOutput item.
 * @param check NoteOutput check.
 * @returns The NoteType identified.
 */
function checkNoteOutputType(itemName: string | undefined, check: string): NoteType {
    if (itemName && (itemName === "Way of the Hero" || itemName === "Hero's Path"))
        return NoteType.LocationGood;
    else if (check in Skulls)
        return NoteType.Skull;
    else if (itemName && itemName === "Barren" && !check)
        // There isn't a check value, so it's just "Deku Tree Barren"
        return NoteType.LocationBad;
    else if (itemName && itemName === "Barren")
        return NoteType.BarrenItem;
    else
        return NoteType.ItemLocation;
}

/**
 * Formats the provided string into the NoteOutput object.
 * This object will be later used for formatting the text displayed to the user.
 * @param input Provided string for note formatting.
 * @returns Correctly formatted NoteOutput object.
 */
export function formatNote(input: string): NoteOutput {
    let deletion = false;
    let inputArr = input.split(" = ");
    // First check if it starts with "del". If it does, cut that out and tell the output that the user is attempting to delete it.
    if (inputArr[0].toLowerCase().startsWith("del ")) {
        deletion = true;
        inputArr[0] = inputArr[0].slice(4);
    }
    const value = resolveString(inputArr[0]);
    const notes = inputArr.length > 1 ? inputArr[1] : undefined;
    let check: string = value;
    // Resolve place, attempt to find earliest mention of a place.
    let place: OoTObject | null = checkStringLocation(check, locationsArr, true);
    let placeName: string | undefined;
    if (place) {
        placeName = place.name;
        // Strip place from check, as the place name is stored separately.
        check = check.replaceAll(regexWordMatch(place.name), "");
    }

    // Resolve item, attempt to find last mention of an item.
    let item: OoTObject | null = checkStringLocation(check, itemsArr, false);
    let itemName: string | undefined;
    if (item) {
        itemName = item.name;
        check = check.replaceAll(regexWordMatch(item.name), "");
    }

    check = check.trim();
    let type: NoteType = checkNoteOutputType(itemName, check);

    return {
        place: placeName,
        item: itemName,
        check: resolveString(check, locationsArr),
        type: type,
        count: 1,
        deletion: deletion,
        notes: notes
    }
}
