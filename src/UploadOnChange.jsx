import React, { Component, createElement } from "react";

export default class UploadOnChange extends Component {
    
    constructor(props) {
        super(props);
        this.nodeRef = React.createRef();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        const parentNode = this.nodeRef.current.parentNode;
        const uploaders = parentNode.querySelectorAll('input[type=file]');
        const trigger = this.onChange;
        
        uploaders.forEach(eventLoop);
        function eventLoop(item) {
            item.onchange = function(e) {
                // short timeout to make sure all the upload widgets are available on the page
                setTimeout(function(){ 
                    trigger();
                }, 100);
            };
        }
    }

    render() {
        return (
            <div ref={this.nodeRef}/>
        );
    }

    onChange() {
        if (this.props.onChangeAction && this.props.onChangeAction.canExecute) {
            this.props.onChangeAction.execute();
        }
    }
}
