// this essentially sets up a singly linked list
import tGridPosition from "./tGridPosition";

export default class GridGamePosition {
    public position: tGridPosition;
    public distance: number;
    public parent: null | GridGamePosition;

    constructor(position: tGridPosition, distance: number, parent: null | GridGamePosition = null) {
        this.position = position;
        this.distance = distance;
        this.parent = parent;
    }
}