import React from 'react';
import Styled from 'styled-components';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import EditableInput from './EditableInput';
import Step from './Step';
import { Container, DraggableHandle, Main, Properties, Name, RemoveButton } from './styles/draggable';
import { AddButton, Controls, PlusIcon, Spinner } from './styles/controls';

const Steps = Styled.div`
    min-height: 2.5rem;
    flex-grow: 1;
`;

export default class Activity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            increment: {
                step: 1,
                min: 1, 
                max: 10,
            }
        }
    }

    onIncrementStepChange = (event) => {
        let value = event.target.value.toLowerCase();

        if (value === 'e') {
            value = this.state.increment.step;
        } else if (value < this.state.increment.min) {
            value = this.state.increment.min;
        } else if (value > this.state.increment.max) {
            value = this.state.increment.max;
        }

        this.setState({
            increment: {
                ...this.state.increment,
                step: value
            }
        });
    }

    render() {
        return (
            <Draggable draggableId={this.props.activity.id} index={this.props.index}>
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
                                        text={this.props.activity.name}
                                        placeholder="Placeholder Activity Name"
                                        type="activity"
                                        field="name"
                                        id={this.props.activity.id}
                                        update={this.props.update}
                                    />
                                </Name>

                                <Controls>
                                    <AddButton onClick={() => this.props.onAddStepClick(this.props.activity.id, this.state.increment.step)}>
                                        <PlusIcon height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                                        <path d="M0 0h24v24H0z" fill="none"></path>
                                        </PlusIcon>
                                        
                                        Create {this.state.increment.step} new {this.state.increment.step > 1 ? 'Steps' : 'Step'}
                                    </AddButton>

                                    <Spinner type="number" min={this.state.increment.min} max={this.state.increment.max} value={this.state.increment.step} onChange={this.onIncrementStepChange} />
                                </Controls>                                  

                                <RemoveButton onClick={() => this.props.onRemoveClick('activity', this.props.activity.id)}>
                                    <i className="fa fa-remove"></i>
                                </RemoveButton>
                            </Properties>

                            <Droppable droppableId={this.props.activity.id} type="step">
                                {(provided) => (
                                    <Steps {...provided.droppableProps} ref={provided.innerRef}>
                                        {this.props.steps.map((step, index) => <Step key={step.id} activityId={this.props.activity.id} step={step} index={index} onRemoveClick={this.props.onRemoveClick} update={this.props.update} />)}
                                        {provided.placeholder}
                                    </Steps>
                                )}
                            </Droppable>
                        </Main>
                    </Container>
                )}
            </Draggable>
        )
    }
}