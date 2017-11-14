import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
                <button onClick={() => this.props.onClick}>
                    {this.props.description}
                </button>
                {this.props.coors &&
                    <p>
                        Square changed: [{this.props.coors[0] + " " + this.props.coors[1]}]
                    </p>
                }                
            </li>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }

    render() {

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
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
        const moves = history.map((historyItem, move) => {
            let desc, coors;
            if (move) {
                desc = 'Go to move #' + move;
                console.log(historyItem);
                coors = this.getSquareCoordinatesByIndex(historyItem.dirtySquareIndex);
            }
            else {
                desc = 'Go to game start';
            }

            return (
                <Move key={move} index={move} description={desc} onClick={() => this.jumpTo(move)} coors={coors} />
            );
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else{
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
        const history = this.state.history.slice(0, this.state.stepNumber +1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{squares: squares, dirtySquareIndex: i }]),
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
