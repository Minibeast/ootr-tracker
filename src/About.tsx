import { Component, ReactElement } from "react";

export default class About extends Component<{}, {}> {
    render(): ReactElement {
        return (
            <>
            <div className="fixed mx-1 bottom-0 left-0">
                <p className="text-lg">
                    <span className="hidden sm:inline">Version: </span>
                    <a className="text-[#4044ff] hover:underline" href={process.env.REACT_APP_GIT_LINK}>{process.env.REACT_APP_GIT_DESCRIBE}</a>
                </p>
            </div>
            </>
        )
    }
}
