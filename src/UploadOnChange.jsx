import React, { Component } from "react";

// If the uploader is not in the DOM yet we watch the parent until it shows up,
// then warn if it never does so a misplaced widget is not silently inert.
const NOT_FOUND_WARNING_MS = 5000;

export default class UploadOnChange extends Component {
    nodeRef = React.createRef();
    uploader = null;
    observer = null;
    warnTimer = null;

    componentDidMount() {
        if (this.attach()) {
            return;
        }

        const parentNode = this.nodeRef.current?.parentNode;
        if (!parentNode) {
            return;
        }

        this.observer = new MutationObserver(() => {
            if (this.attach()) {
                this.stopWatching();
            }
        });
        this.observer.observe(parentNode, { childList: true, subtree: true });

        this.warnTimer = setTimeout(() => {
            this.warnTimer = null;
            console.warn(
                "UploadOnChange: no file input found in the parent container. " +
                    "Place the widget in the same container as the file/image upload widget."
            );
        }, NOT_FOUND_WARNING_MS);
    }

    componentWillUnmount() {
        this.stopWatching();
        if (this.uploader) {
            this.uploader.removeEventListener("change", this.onChange);
            this.uploader = null;
        }
    }

    attach() {
        const uploader = this.nodeRef.current?.parentNode?.querySelector("input[type=file]");
        if (!uploader) {
            return false;
        }

        this.uploader = uploader;
        uploader.addEventListener("change", this.onChange);
        return true;
    }

    stopWatching() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.warnTimer !== null) {
            clearTimeout(this.warnTimer);
            this.warnTimer = null;
        }
    }

    render() {
        return <div ref={this.nodeRef} />;
    }

    onChange = () => {
        const action = this.props.onChangeAction;
        if (action?.canExecute && !action.isExecuting) {
            action.execute();
        }
    };
}
