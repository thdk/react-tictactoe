import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function loop(nr, fn) {
    return [...Array(nr)].map((_, i) => fn(i));
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Move extends React.Component {
    render(props) {
        return (
            <li key={this.props.index}>
                <button onClick={this.props.onClick}>
                    {this.props.description}
                </button>
                {this.props.coors && this.props.isSelected ? (
                    <p><strong>Square changed: [{this.props.coors[0] + " " + this.props.coors[1]}]</strong></p>
                ) : (this.props.coors &&
                    <p>Square changed: [{this.props.coors[0] + " " + this.props.coors[1]}]</p>
                    )}
            </li>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.gridSize = 3;
    }

    renderSquare(i) {
        return;
    }    

    render() {        
        return (
            <div>
                {loop(this.gridSize, rowIndex =>
                    <div className="board-row"> {
                        loop(this.gridSize, columnIndex => {
                            const squareIndex = rowIndex + this.gridSize * columnIndex;
                            return <Square value={this.props.squares[squareIndex]} onClick={() => this.props.onClick(squareIndex)} />
                        })
                    } </div>
                )}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((historyItem, index) => {
            let description, coors;
            if (index !== 0) {
                description = 'Go to move #' + index;
                coors = this.getSquareCoordinatesByIndex(historyItem.dirtySquareIndex);
            }
            else {
                description = 'Go to game start';
            }

            const moveProps = {
                index,
                description,
                coors,
                isSelected: index === this.state.stepNumber,
                onClick: (e) => this.jumpTo(index, e)
            };

            return <Move key={index} {...moveProps} />;
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{ squares: squares, dirtySquareIndex: i }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    getSquareCoordinatesByIndex(index) {
        return [index % 3, Math.floor(index / 3)];
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
