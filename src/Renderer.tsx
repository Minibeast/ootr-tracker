import { ReactElement } from "react";
import { NoteOutput, NoteType } from "./Util";
import Notes from "./Notes";

import Star from "./svg/star.svg";
import StarOutline from "./svg/star-outline.svg";
import XMark from "./svg/xmark.svg";

export function renderItem(item: NoteOutput, noteClass?: Notes, showIcons: boolean = false): ReactElement {
    let placeName: string = item.place ? item.place : "";
    let itemName: string = item.item ? item.item : "";
    let deleteText: ReactElement = <></>;
    if (item.deletion)
        deleteText = 
            <>
            <th className="px-2.5">Delete: </th>
            </>

    let checkElement: ReactElement = 
        <>
        <th className="bg-fuchsia-400 px-2.5 capitalize">{item.check}</th>
        </>;

    let placeElement: ReactElement = 
        <>
        <th className="bg-cyan-400 px-2.5">{placeName}</th>
        </>;

    let itemElement: ReactElement;
    if (itemName === "Barren") {
        itemElement = 
            <>
            <th className="bg-red-400 px-2.5">Barren</th>
            </>;
    } else {
        itemElement = 
            <>
            <th className="bg-emerald-400 px-2.5">{itemName}</th>
            </>;
    }

    let noteElement: ReactElement = <><th className="px-2.5" /></>;
    if (item.notes) {
        noteElement = 
        <>
        <th className="pl-6 pr-2.5 text-left">
            <ul className="list-disc">
                {item.notes.split("*").map((v: string, index: number) => (
                    <li key={index}>{v}</li>
                ))}
            </ul>
        </th>
        </>
    }

    let multipleElement: ReactElement = <th className="text-left pl-2.5 pr-1.5" />;
    if (item.count > 1) {
        let countTmp = item.count - 1;
        let countDouble = countTmp / 2;
        let countInt = Math.floor(countDouble);
        let stars: ReactElement = 
            <>
            {[...Array(countInt)].map((e: any, i: number) => (
                <img key={i} className="align-middle" width="25px" src={Star} alt="Star" />
            ))}
            {(countDouble % 1) !== 0 && (
                <img key={countInt + 1} className="align-middle" width="25px" src={StarOutline} alt="Outline of Star" />
            )}
            </>;
        multipleElement = 
            <>
            <th className="text-left pl-2.5 pr-1.5">{stars}</th>
            </>
    }

    let buttonElements: ReactElement = <></>;
    if (noteClass && showIcons) {
        buttonElements = 
        <>
        <th className="px-2.5 align-middle">
            <div className="float-left px-0.5">
                <img className="cursor-pointer" onClick={noteClass.removeItem.bind(noteClass, item)} width="15px" src={XMark} alt="X Marker" />
            </div>
            <div className="float-left px-0.5">
                <img className="cursor-pointer" onClick={noteClass.addItem.bind(noteClass, item)} width="25px" src={Star} alt="Star" />
            </div>
        </th>
        </>
    }

    if (item.type === NoteType.LocationBad || item.type === NoteType.LocationGood)
        return (
            <>
            {deleteText}
            {placeElement}
            {itemElement}
            {noteElement}
            {multipleElement}
            {buttonElements}
            </>
        )
    else if (item.type === NoteType.Skull)
        return (
            <>
            {deleteText}
            <th className="bg-orange-400 px-2.5">HoS</th>
            {checkElement}
            {itemElement}
            {noteElement}
            {multipleElement}
            {buttonElements}
            </>
        )
    else if (item.type === NoteType.None)
        return (<></>)
    else
        return (
            <>
            {deleteText}
            {placeElement}
            {checkElement}
            {itemElement}
            {noteElement}
            {multipleElement}
            {buttonElements}
            </>
        )
}
