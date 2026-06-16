ex:

A { x: 0, width: 2, idx: 0, y: 0, height: 50 }
B { x: 2, width: 2, idx: 1, y: 0, height: 100 }
C { x: 0, width: 2, idx: 2, y: 50, height: 50 }

Moving C to mouse { x: 1, y: 50}
Because C collision with B so result is:
Using dragging:
A { x: 0, width: 2, idx: 0, y: 0, height: 50 }
B { x: 2, width: 2, idx: 1, y: 100, height: 100 }
C { x: 0, width: 2, idx: 0.5, y: 50, height: 50 }
-> keep all, only update index for C. Update y for B.

End dragging:
A { x: 0, width: 2, idx: 0, y: 0, height: 50 }
B { x: 2, width: 2, idx: 1, y: 100, height: 100 }
C { x: 1, width: 2, idx: 0.5, y: 50, height: 50 }
-> update all of C and B.
