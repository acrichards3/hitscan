export interface GameState {
    players: Record<string, PlayerState>;
}

export interface PlayerState {
    direction: Quaternion;
    position: Vector3;
    isWalking: boolean;
    isSprinting: boolean;
    isCrouching: boolean;
    isJumping: boolean;
    isAiming: boolean;
    isShooting: boolean;
}

export interface Quaternion extends Vector3 {
    w: number;
}

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

// Linked list used for storing game states
export class ListNode {
    state: GameState | null;
    next: ListNode | null;

    constructor(state: GameState | null = null, next: ListNode | null = null) {
        this.state = state;
        this.next = next;
    }
}

export class LinkedList {
    head: ListNode | null = null;

    // Add a new node to the end of the list
    append(state: GameState): void {
        const newNode = new ListNode(state);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    // Allows you to "reverse" the recording
    static reverseList(head: ListNode | null): ListNode | null {
        let prev = null;
        let current = head;
        let next = null;
        while (current !== null) {
            next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        return prev;
    }
}
