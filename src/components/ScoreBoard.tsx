export interface IScoreBoard {
  score: number;
}

const ScoreBoard: React.FunctionComponent<IScoreBoard> = ({ score }: IScoreBoard) => {
  return (
    <div className="score-board">
      <h2>Score: {score}</h2>
    </div>
  );
};

export default ScoreBoard;
