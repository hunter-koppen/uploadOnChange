import React, { Component, createElement } from "react";

export default class UploadOnChange extends Component {
    nodeRef = React.createRef();

    componentDidMount() {
        setTimeout(() => {
            // short timeout to make sure all the upload widgets are available on the page
            const parentNode = this.nodeRef.current.parentNode;
            const uploader = parentNode.querySelector("input[type=file]");

            uploader.onchange = this.onChange;
        }, 200);
    }

    render() {
        return <div ref={this.nodeRef} />;
    }

    onChange = () => {
        if (this.props.onChangeAction) {
            this.props.onChangeAction.execute();
        }
    };
}
