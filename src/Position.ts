// this essentially sets up a singly linked list
import tGridPosition from "./tGridPosition";

export default class Position {
    public position: tGridPosition;
    public distance: number;
    public parent: null | Position;

    constructor(position: tGridPosition, distance: number, parent: null | Position = null) {
        this.position = position;
        this.distance = distance;
        this.parent = parent;
    }
}