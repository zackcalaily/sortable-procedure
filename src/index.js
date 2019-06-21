import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import ShortID from 'shortid';
import Styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { init } from 'contentful-ui-extensions-sdk';

import Activity from './components/Activity';
import { AddButton, Controls, PlusIcon, Spinner } from './components/styles/controls';

import 'normalize.css';
import './index.css';

const Container = Styled.div` 
    margin-top: 12px;
`;

class SortableProcedure extends React.Component {
    static propTypes = {
        sdk: PropTypes.object.isRequired
    };

    detachExternalChangeHandler = null;

    constructor(props) {
        super(props);

        this.state = {
            procedure: props.sdk.field.getValue() || this.initialProcedureState(),
            increment: {
                step: 1,
                min: 1,
                max: 3,
            }
        };

        console.log(this.state);
    }

    initialProcedureState = () => {
        return {
            activities: {},
            activityOrder: [],
            steps: {},
        };   
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

    onAddActivityClick = (amount) => {
        const activities = { ...this.state.procedure.activities };
        const activityOrder = [...this.state.procedure.activityOrder];
        
        for (let i = 0; i < amount; i++) {
            const activityId = ShortID.generate();

            activities[activityId] = {
                id: activityId,
                name: null,
                stepOrder: [],
            };

            activityOrder.push(activityId);
        }

        const procedure = {
            ...this.state.procedure,
            activities: activities,
            activityOrder: activityOrder
        };

        this.updateProcedure(procedure);
    }

    onAddStepClick = (activityId, amount) => {
        const activities = { ...this.state.procedure.activities };
        const activity = activities[activityId];
        const steps = { ...this.state.procedure.steps }
        const stepOrder = [...activity.stepOrder];

        for (let i = 0; i < amount; i++) {
            const stepId = ShortID.generate();

            steps[stepId] = {
                id: stepId,
                name: null,
                details: null
            };

            stepOrder.push(stepId);
        }

        const updatedActivity = {
            ...this.state.procedure.activities[activity.id],
            stepOrder: stepOrder,
        };

        const procedure = {
            ...this.state.procedure,
            steps: steps,
            activities: {
                ...this.state.procedure.activities,
                [activity.id]: updatedActivity
            }
        }            

        this.updateProcedure(procedure);
    }

    onRemoveClick = (type, activityId, stepId = null) => {
        // If removing an activity...
        if (type === 'activity') {
            // Cheeck to see if the activity has steps...
            const activity = this.state.procedure.activities[activityId];

            // If there are steps, prompt the user with a confirmation dialog box
            if (activity.stepOrder.length > 0) {
                this.props.sdk.dialogs.openConfirm({
                    title: `Remove ${activity.name || 'Untitled'}?`,
                    message: `The activity "${activity.name || 'Untitled'}" has ${activity.stepOrder.length} procedure ${activity.stepOrder.length > 1 ? 'steps' : 'step'}.
                        Deleting this activity will also delete all the steps. Do you want to proceed?`,
                    confirmLabel: 'Yes, delete the activity and its steps',
                    cancelLabel: 'Nevermind'
                })
                    .then(result => {
                        if (result === true) {
                            this.removeActivity(activityId);
                        }
                    })
            }

            // If there are no steps, then delete the activity without prompt
            else {
                this.removeActivity(activityId);
            }
        }

        // If removing a step...
        else if (type === 'step') {
            const activities = { ...this.state.procedure.activities }
            const activity = activities[activityId];
            const stepOrder = [...activity.stepOrder];
            const steps = { ...this.state.procedure.steps }

            // Remove the step
            delete steps[stepId];

            // Remove the step from the activity's step order
            const reducedActivityStepOrder = stepOrder.filter(id => id !== stepId);
            const updatedActivity = {
                ...activity,
                stepOrder: reducedActivityStepOrder
            };

            const procedure = {
                ...this.state.procedure,
                steps: steps,
                activities: {
                    ...this.state.procedure.activities,
                    [updatedActivity.id]: updatedActivity
                }
            };

            this.updateProcedure(procedure);
        }
    }

    onExternalChangeHandler = (value) => {
        this.setState({ procedure: value || this.initialProcedureState() });
    }

    onDragStart = () => {
        // Stop the autoresizer or it messes with the dragging
        this.props.sdk.window.stopAutoResizer();
    }

    onDragEnd = (event) => {
        const { destination, source, draggableId, type } = event;

        // If the draggable has been moved outside the drag and drop context, do nothing
        if (!destination) {
            return;
        }

        // If the draggable has been dropped on the same position, do nothing 
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // If the user dragged an activity...
        if (type === 'activity') {
            const activityOrder = [...this.state.procedure.activityOrder];
            activityOrder.splice(source.index, 1);
            activityOrder.splice(destination.index, 0, draggableId);

            const procedure = {
                ...this.state.procedure,
                activityOrder: activityOrder
            }

            this.updateProcedure(procedure);
        }
        
        // If the user dragged a step...
        else {
            const sourceActivity = this.state.procedure.activities[source.droppableId];
            const destinationActivity = this.state.procedure.activities[destination.droppableId];

            // If the step was re-ordered within the same activity...
            if (sourceActivity === destinationActivity) {
                const stepOrder = [...sourceActivity.stepOrder];
                stepOrder.splice(source.index, 1);
                stepOrder.splice(destination.index, 0, draggableId);

                const activity = {
                    ...sourceActivity,
                    stepOrder: stepOrder
                };

                const procedure = {
                    ...this.state.procedure,
                    activities: {
                        ...this.state.procedure.activities,
                        [activity.id]: activity
                    }
                };

                this.updateProcedure(procedure);
            } 

            // If the step was moved to another activity 
            else {
                const sourceActivityStepOrder = [...sourceActivity.stepOrder];
                const destinationActivityStepOrder = [...destinationActivity.stepOrder];

                sourceActivityStepOrder.splice(source.index, 1);
                destinationActivityStepOrder.splice(destination.index, 0, draggableId);

                const updatedSourceActivity = {
                    ...sourceActivity,
                    stepOrder: sourceActivityStepOrder,
                };

                const updatedDestinationActivity = {
                    ...destinationActivity,
                    stepOrder: destinationActivityStepOrder,
                };

                const procedure = {
                    ...this.state.procedure,
                    activities: {
                        ...this.state.procedure.activities,
                        [updatedSourceActivity.id]: updatedSourceActivity,
                        [updatedDestinationActivity.id]: updatedDestinationActivity
                    }
                };

                this.updateProcedure(procedure);
            }
        }

        this.props.sdk.window.startAutoResizer();
    }

    updateProcedure = (procedure) => {
        this.setState({ procedure: procedure });
        this.props.sdk.field.setValue(procedure);
    }

    removeActivity = (id) => {
        const activities = { ...this.state.procedure.activities };
        const activityOrder = [...this.state.procedure.activityOrder];

        delete activities[id]; 
        const reducedActivityOrder = activityOrder.filter(activityId => activityId !== id);

        const procedure = {
            ...this.state.procedure,
            activities: activities,
            activityOrder: reducedActivityOrder
        };

        this.updateProcedure(procedure);
    }

    update = (type, id, field, value) => {
        if (type === 'activity') {
            const activities = { ...this.state.procedure.activities };
            activities[id][field] = value;

            const procedure = {
                ...this.state.procedure,
                activities: activities
            }

            this.updateProcedure(procedure);

        } else if (type === 'step') {
            const steps = { ...this.state.procedure.steps };
            steps[id][field] = value;

            const procedure = {
                ...this.state.procedure,
                steps: steps
            };

            this.updateProcedure(procedure);
        }
    }
    
    componentDidMount() {
        this.props.sdk.window.startAutoResizer();

        // Handler for external field value changes (e.g. when multiple authors are working on the same entry)
        this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChangeHandler);
    }

    render() {
        return (
            <Container>
                <Controls>
                    <AddButton onClick={() => this.onAddActivityClick(this.state.increment.step)}>
                        <PlusIcon height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                           <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                           <path d="M0 0h24v24H0z" fill="none"></path>
                        </PlusIcon>
                        
                        Create {this.state.increment.step} new {this.state.increment.step > 1 ? 'Activities' : 'Activity'}
                    </AddButton>

                    <Spinner type="number" min={this.state.increment.min} max={this.state.increment.max} value={this.state.increment.step} onChange={this.onIncrementStepChange} />
                </Controls>

                <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="activities" type="activity">
                        {(provided) => (
                            <Container {...provided.droppableProps} ref={provided.innerRef}>
                                {this.state.procedure.activityOrder.map((activityId, index) => {
                                    const activity = this.state.procedure.activities[activityId];
                                    const steps = activity.stepOrder.map(stepId => this.state.procedure.steps[stepId]);

                                    return <Activity
                                        key={activity.id}
                                        activity={activity}
                                        steps={steps}
                                        index={index}
                                        onAddStepClick={this.onAddStepClick}
                                        onRemoveClick={this.onRemoveClick}
                                        update={this.update}
                                    />
                                })}

                                {provided.placeholder}
                            </Container>
                        )}
                    </Droppable>
                </DragDropContext>
            </Container>
        )
    }
}

console.clear();        // TODO: remove after development

init(sdk => {
    ReactDOM.render(<SortableProcedure sdk={sdk} />, document.getElementById('root'));
});

// TODO: Add external change handler for collaborative editing