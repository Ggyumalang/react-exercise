import { useState } from "react"

function Square({value, onSquareClick} : {value:string, onSquareClick:any}) {    
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    )
}

export default function Game() {
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null))
    const winner = calculateWinner(squares);
    let status = winner ? "Winner: " + winner : "Next player: " + (xIsNext ? "X" : "O");

    function handleClick (idx: number) {
        if(squares[idx]) {
            return;
        }

        if(calculateWinner(squares)) {            
            setSquares(Array(9).fill(null))
            return;
        }

        const nextSquares = squares.slice();        
        nextSquares[idx] = xIsNext ? 'X' : 'O';        
        setSquares(nextSquares);        
        setXIsNext(!xIsNext);
    }

    function sliceSquares(start : number, end : number) {
        return squares.slice(start, end).map((square, index) => {
            return <Square value = {square} onSquareClick={() => handleClick(start+index)}/>                                            
        })  
    }
    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                { sliceSquares(0,3) }                               
            </div> 
            <div className="board-row">
                { sliceSquares(3,6) }                               
            </div>
            <div className="board-row">
                { sliceSquares(6,9) }                               
            </div>
        </>
    )
}

function calculateWinner(squares:string[]) {
    const lines = [
       [0, 1, 2],
       [3, 4, 5],
       [6, 7, 8],
       [0, 3, 6],
       [1, 4, 7],
       [2, 5, 8],
       [0, 4, 8],
       [2, 4, 6]
    ]

    for(let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
            return squares[a];
        }
    }
    return null;
}