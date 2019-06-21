import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import React from 'react'
import Styled from 'styled-components';

const SaveButton = Styled.button`
    border-color: #3072be;
    background-image: linear-gradient(0deg, #3c80cf, #5b9fef);
    background-size: 100% 200%;
    border: .0625rem solid #c3cfd5;
    font-size: .875rem;
    transition: background .2s ease-in-out, opacity: .2 ease-in-out, border-color: .2s ease-in-out;
    height: 2.5rem;
    padding: 0 .875rem;
    color: #f7f9fa;
    margin-top: 5px;
`;

const Label = Styled.label`
    display: block;
    width: 100%;
`;

export default class EditableWYSIWYG extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditing: this.props.isEditing || false,
            text: this.props.text || '',
        }
    }

    toggleEditingState = () => {
        this.setState({ isEditing: !this.state.isEditing });
    }

    stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }

    onChange = (event, editor) => {
        this.setState({ text: editor.getData() });
        this.props.update(this.props.type, this.props.id, this.props.field, editor.getData());
    }

    onFocus = () => {
        this.toggleEditingState();
    }

    onKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.toggleEditingState();
        }
    }

    render() {
        if (this.state.isEditing) {
            return (
                <>
                    <CKEditor 
                        editor={ClassicEditor}
                        data={this.state.text}
                        onChange={this.onChange}
                        onBlur={this.onFocus}
                        autoFocus 
                    />

                    <SaveButton onClick={this.onFocus}>
                        Save Changes
                    </SaveButton>
                </>
            );
        } else {
            return (
                <Label onClick={this.onFocus}>
                    {this.stripHtml(this.state.text) || this.props.placeholder}
                </Label>
            )
        }
    }
}

