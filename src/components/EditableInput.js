import React from 'react'
import Styled from 'styled-components';

const Input = Styled.input`
    outline: none;
    background-color: #fff;
    border: 1px solid #dedce0;
    max-height: 2.5rem;
    color: #536171;
    font-size: .875rem;
    padding: .656rem;
    margin: 0;
    width: 90%;
`;

const Label = Styled.label`
    display: block;
    width: 100%;
`;

export default class EditableInput extends React.Component {
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

    onChange = () => {
        this.setState({ text: this.input.value });
        this.props.update(this.props.type, this.props.id, this.props.field, this.input.value);
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
                <Input type="text"
                    placeholder={this.props.placeholder}
                    value={this.state.text}
                    ref={(input) => { this.input = input }}
                    onChange={this.onChange}
                    onBlur={this.onFocus}
                    onKeyDown={this.onKeyDown}
                    autoFocus
                />
            );
        } else {
            return (
                <Label onClick={this.onFocus}>
                    {this.state.text || this.props.placeholder}
                </Label>
            )
        }
    }
}

