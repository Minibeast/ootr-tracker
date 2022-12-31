import React, { RefObject, Component, createRef } from 'react';
import './App.css';

import InputBox from './InputBox';
import Notes from './Notes';
import About from './About';

class App extends Component {
    notes: RefObject<Notes>;
    inputBox: RefObject<HTMLInputElement>;
    constructor(props: any) {
        super(props);
        this.notes = createRef();
        this.inputBox = createRef();
    }

    componentDidMount(): void {
        document.body.addEventListener('keydown', (e) => {
            if (e.shiftKey) {
                if (this.notes.current)
                    this.notes.current.showIcons();
            }
            let activeElement = document.activeElement;
            if (this.inputBox.current && this.inputBox.current !== activeElement)
                this.inputBox.current.focus();
        });
        document.body.addEventListener('keyup', (e) => {
            if (!e.shiftKey) {
                if (this.notes.current)
                    this.notes.current.releaseIcons();
            }
        });
    }

    render() {
        return (
            <div className='App'>
                <Notes ref={this.notes} />
                <InputBox notes={this.notes} inputBox={this.inputBox} />
                <About />
            </div>
        )
    }
}

export default App;
