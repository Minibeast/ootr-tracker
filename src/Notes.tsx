import { Component, ReactElement } from "react";
import { NoteOutput, NoteType, checkNoteExists, sortNoteOutputArray } from "./Util";
import { renderItem } from "./Renderer";

interface NoteState {
    ItemLocations: NoteOutput[];
    GoodLocations: NoteOutput[];
    BadLocations: NoteOutput[];
    Skulls: NoteOutput[];
    BarrenItems: NoteOutput[];
    showIcons: boolean;
}

function handleAddItem(item: NoteOutput, arr: NoteOutput[]): NoteOutput[] {
    let itemIndex = -1;
    itemIndex = checkNoteExists(item, arr);
    if (itemIndex !== -1) {
        arr[itemIndex].count++;
        if (item.notes && arr[itemIndex].notes !== item.notes) {
            arr[itemIndex].notes = item.notes;
            arr[itemIndex].count--;
        }
    }
    else arr.push(item);

    return arr;
}

function handleRemoveItem(item: NoteOutput, arr: NoteOutput[]): NoteOutput[] {
    let itemIndex = -1;
    itemIndex = checkNoteExists(item, arr);
    if (itemIndex !== -1) arr.splice(itemIndex, 1);

    return arr;
}

export default class Notes extends Component<{}, NoteState> {
    constructor(props: any) {
        super(props);
        this.state = {
            ItemLocations: [],
            GoodLocations: [],
            BadLocations: [],
            Skulls: [],
            BarrenItems: [],
            showIcons: false
        };
    }

    showIcons(): void {
        this.setState({showIcons: true});
    }

    releaseIcons(): void {
        this.setState({showIcons: false});
    }

    removeItem(item: NoteOutput): void {
        switch(item.type) {
            case NoteType.ItemLocation:
                this.setState({ItemLocations: handleRemoveItem(item, this.state.ItemLocations)});
                break;
            case NoteType.LocationGood:
                this.setState({GoodLocations: handleRemoveItem(item, this.state.GoodLocations)});
                break;
            case NoteType.LocationBad:
                this.setState({BadLocations: handleRemoveItem(item, this.state.BadLocations)});
                break;
            case NoteType.Skull:
                this.setState({Skulls: handleRemoveItem(item, this.state.Skulls)});
                break;
            case NoteType.BarrenItem:
                this.setState({BarrenItems: handleRemoveItem(item, this.state.BarrenItems)});
                break;
        }
    }

    addItem(item: NoteOutput): void {
        switch(item.type) {
            case NoteType.ItemLocation:
                this.setState({ItemLocations: handleAddItem(item, this.state.ItemLocations)});
                break;
            case NoteType.LocationGood:
                this.setState({GoodLocations: handleAddItem(item, this.state.GoodLocations)});
                break;
            case NoteType.LocationBad:
                this.setState({BadLocations: handleAddItem(item, this.state.BadLocations)});
                break;
            case NoteType.Skull:
                this.setState({Skulls: handleAddItem(item, this.state.Skulls)});
                break;
            case NoteType.BarrenItem:
                this.setState({BarrenItems: handleAddItem(item, this.state.BarrenItems)});
                break;
        }
    }

    render(): ReactElement {
        return (
            <>
            <div>
                <p className="text-4xl mx-4 md:mx-10 font-bold my-2">Items</p>
                <table className="table-auto mx-6 md:mx-20">
                    <tbody>
                        {this.state.ItemLocations.map((item: NoteOutput, index: number) => (
                            <tr key={index + item.type}>{renderItem(item, this, this.state.showIcons)}</tr>
                        ))}
                        {this.state.BarrenItems.length > 0 && (
                            <tr>
                                <th className="text-left">Barren Items</th>
                            </tr>
                        )}
                        {this.state.BarrenItems.map((item: NoteOutput, index: number) => (
                            <tr key={index + item.type}>{renderItem(item, this, this.state.showIcons)}</tr>
                        ))}
                        {this.state.Skulls.length > 0 && (
                            <tr>
                                <th className="text-left">Skull Rewards</th>
                            </tr>
                        )}
                        {sortNoteOutputArray(this.state.Skulls).map((item: NoteOutput, index: number) => (
                            <tr key={index + item.type}>{renderItem(item, this, this.state.showIcons)}</tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <p className="text-4xl mx-4 md:mx-10 font-bold my-2">Locations</p>
                <table className="table-auto mx-6 md:mx-20">
                    <tbody>
                        {this.state.GoodLocations.map((item: NoteOutput, index: number) => (
                            <tr key={index + item.type}>{renderItem(item, this, this.state.showIcons)}</tr>
                        ))}
                        {this.state.BadLocations.length > 0 && (
                            <tr>
                                <th className="text-left">Barren Locations</th>
                            </tr>
                        )}
                        {this.state.BadLocations.map((item: NoteOutput, index: number) => (
                            <tr key={index + item.type}>{renderItem(item, this, this.state.showIcons)}</tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </>
        )
    }
}
