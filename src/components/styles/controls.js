import Styled from 'styled-components';

import dottedBorderImage from '../../images/dotted-border.svg';

export const Controls = Styled.div`
    display: flex;
    align-items: center;

    button {
        margin-right: 20px;
    }
`;

export const AddButton = Styled.button`
    background: none;
    border: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    color: #3c80cf;
    text-decoration: underline;

    &:hover {
        color: #2a3039;
    }

    &:hover svg {
        fill: #2a3039;
    }
`;

export const PlusIcon = Styled.svg`
    height: 18px;
    width: 18px;
    fill: #3c80cf;
    margin-right: 4px;
`;

export const Spinner = Styled.input`
    color: #2a3039;
    border-image-source: url(${dottedBorderImage});
    border-image-repeat: round;
    border-image-slice: 1 1;
    border-image-width: 0 0 1px 0;
    border-color: transparent;
    border-style: solid;
    background-color: transparent;
    padding: 0 2px;
`;