import Styled from 'styled-components';

export const Container = Styled.div`
    background-color: #fff;
    border: 1px solid #d3dce0;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .08);
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    font-size: .875rem;
    min-height: 5.25rem;
    line-height: 1.5;
    margin-top: 12px;
    position: relative;
    text-decoration: none;
    transition: box-shadow .2s ease-in-out, border-color: .2s ease-in-out;

    &:hover,
    &:focus {
        border-color: #5b9fef;
    }
`;

export const DraggableHandle = Styled.a`
    display: flex;
    align-items: center;
    background-color: #f7f9fa;
    border: 0;
    border-right: 1px solid #d3dce0;
    cursor: grab;
    height: 100%;
    padding: 0;
    position: absolute;
    transition: background-color .2s ease-in-out;
    width: 1.25rem;

    &:hover,
    &:focus {
        background-color: #e5ebed;
    }

    span {
        display: flex;
        align-items: center;
        height: 100%;
        left: 0;
        outline: 0;
        position: absolute;
        top: 0;
        width: 100%;
        overflow: hidden;
    }

    svg {
        fill: #8091a5;
        height: 18px;
        width: 18px;
    }
`;

export const Main = Styled.div`
    display: block;
    flex: 1 1 0;
    overflow: hidden;
    padding: .875rem;
    margin-left: 1.25rem;
    height: 100%;
`;

export const Properties = Styled.div`
    display: flex;
    margin-bottom: .75rem;
`; 

export const Name = Styled.div`
    flex: 1 1 0;
    padding-right: 1.25rem;
    color: #8091a5;
    font-size: .875rem;
`;

export const RemoveButton = Styled.div`
    background-color: transparent;
    border: 0;
    cursor: pointer;
    display: inline-block;
    padding: 0;
    margin-left: 40px;
`;