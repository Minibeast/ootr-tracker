import { ChangeEvent, Component, KeyboardEvent, RefObject } from "react";
import { formatNote, NoteOutput, NoteType } from "./Util";
import Notes from "./Notes";
import { renderItem } from "./Renderer";

const blankNoteOutput: NoteOutput = {
    check: "",
    type: NoteType.None,
    count: 0,
    deletion: false
}

interface InputBoxState {
    resolutionOutput: NoteOutput;
}

interface InputBoxProps {
    notes: RefObject<Notes>;
    inputBox: RefObject<HTMLInputElement>;
}

export default class InputBox extends Component<InputBoxProps, InputBoxState> {
    constructor(props: any) {
        super(props);
        this.state = {
            resolutionOutput: blankNoteOutput
        }
    };

    onTextChanged(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (!value)
            this.setState({resolutionOutput: blankNoteOutput});
        else
            this.setState({resolutionOutput: formatNote(value)});
    };

    onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            const value = (e.target as HTMLInputElement).value;
            if (!value) { return; }

            if (this.props.notes.current) {
                if (value.startsWith("del "))
                    this.props.notes.current.removeItem(formatNote(value.slice(4)));
                else
                    this.props.notes.current.addItem(formatNote(value));
            }
            (e.target as HTMLInputElement).value = "";
            this.setState({resolutionOutput: blankNoteOutput});
        }
    }

    render() {
        return (
            <>
            <footer className="fixed bottom-2 mb-auto inset-x-0">
                <div className="my-1 text-center">
                    <table className="table-auto mx-auto my-2">
                        <tbody>
                            <tr>{renderItem(this.state.resolutionOutput)}</tr>
                        </tbody>
                    </table>
                    <input ref={this.props.inputBox} type="text" id="inputBox" spellCheck="false" autoComplete="off" onKeyDown={this.onKeyDown.bind(this)} onChange={this.onTextChanged.bind(this)}></input>
                </div>
            </footer>
            </>
        );
    };
};
