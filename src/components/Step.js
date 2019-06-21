import React from 'react';
import Styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

import EditableInput from './EditableInput';
import { Container, DraggableHandle, Main, Properties, Name, RemoveButton } from './styles/draggable';
import EditableWYSIWYG from './EditableWYSIWYG';

const Content = Styled.div`
    color: #2a3039;
    font-weight: bold;
    line-height: 1.5;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    white-space: nowrap;
`;

export default class Step extends React.Component {
    render() {
        return (
            <Draggable draggableId={this.props.step.id} index={this.props.index}>
                {(provided) => (
                    <Container {...provided.draggableProps} ref={provided.innerRef}>
                        <DraggableHandle {...provided.dragHandleProps}>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="none" d="M0 0h24v24H0V0z"></path>
                                    <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                                </svg>                                
                            </span>
                        </DraggableHandle>
                        
                        <Main>
                            <Properties>
                                <Name>
                                    <EditableInput
                                        text={this.props.step.name}
                                        placeholder="Placeholder Step Name"
                                        type="step"
                                        field="name"
                                        id={this.props.step.id}
                                        update={this.props.update}
                                    />                                    
                                </Name>

                                <RemoveButton onClick={() => this.props.onRemoveClick('step', this.props.activityId, this.props.step.id)}>
                                    <i className="fa fa-remove"></i>
                                </RemoveButton>
                            </Properties>

                            <Content>
                                <EditableWYSIWYG
                                    text={this.props.step.details}
                                    placeholder="Placeholder Step Details"
                                    type="step"
                                    field="details"
                                    id={this.props.step.id}
                                    update={this.props.update}
                                />
                            </Content>
                        </Main>
                    </Container>
                )}
            </Draggable>
        );
    }
}