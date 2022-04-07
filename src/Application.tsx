import React, { useCallback, useEffect, useState } from 'react';
import ScoreBoard from './components/ScoreBoard';
import candy1 from './images/candy-1.png';
import candy2 from './images/candy-2.png';
import candy3 from './images/candy-3.png';
import candy4 from './images/candy-4.png';
import candy5 from './images/candy-5.png';
import candy6 from './images/candy-6.png';
import candy7 from './images/candy-7.png';
import blankCandy from './images/blank-candy.png';

const width = 8;
const candyColor: string[] = [candy1, candy2, candy3, candy4, candy5, candy6, candy7];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);

  const [draggedSquare, setDraggedSquare] = useState<HTMLImageElement | null>(new Image());
  const [replacedSquare, setReplacedSquare] = useState<HTMLImageElement | null>(new Image());

  useEffect(() => {
    const createBoard: string[] = Array.from({ length: width * width }, () => candyColor[Math.floor(Math.random() * candyColor.length)]);

    setCurrentColorArrangement(createBoard);
  }, []);

  const checkForColumnOfFour = useCallback((): boolean => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour: number[] = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blankCandy;

      if (columnOfFour.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScore((prev) => prev + 4);
        columnOfFour.forEach((square) => (currentColorArrangement[square] = blankCandy));
        return true;
      }
    }
    return false;
  }, [currentColorArrangement]);

  const checkForColumnOfThree = useCallback((): boolean => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree: number[] = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blankCandy;

      if (columnOfThree.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScore((prev) => prev + 3);
        columnOfThree.forEach((square) => (currentColorArrangement[square] = blankCandy));
        return true;
      }
    }
    return false;
  }, [currentColorArrangement]);

  const checkForRowOfFour = useCallback((): boolean => {
    for (let i = 0; i < 47; i++) {
      const rowOfFour: number[] = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];
      if (notValid.includes(i)) continue;

      const isBlank = currentColorArrangement[i] === blankCandy;
      if (rowOfFour.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScore((prev) => prev + 4);
        rowOfFour.forEach((square) => (currentColorArrangement[square] = blankCandy));
        return true;
      }
    }
    return false;
  }, [currentColorArrangement]);

  const checkForRowOfThree = useCallback((): boolean => {
    for (let i = 0; i < 47; i++) {
      const rowOfThree: number[] = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
      if (notValid.includes(i)) continue;
      const isBlank = currentColorArrangement[i] === blankCandy;

      if (rowOfThree.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScore((prev) => prev + 3);
        rowOfThree.forEach((square) => (currentColorArrangement[square] = blankCandy));
        return true;
      }
    }
    return false;
  }, [currentColorArrangement]);

  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstrow = firstRow.includes(i);
      if (isFirstrow && currentColorArrangement[i] === blankCandy) {
        currentColorArrangement[i] = candyColor[Math.floor(Math.random() * candyColor.length)];
      }
      if (currentColorArrangement[i + width] === blankCandy) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blankCandy;
      }
    }
  }, [currentColorArrangement]);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForColumnOfThree();
      checkForRowOfFour();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);
    return () => clearInterval(timer);
  }, [checkForColumnOfFour, checkForColumnOfThree, checkForRowOfFour, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangement]);

  const dragStart = (e: React.DragEvent<HTMLImageElement>) => {
    setDraggedSquare(e.target as HTMLImageElement);
  };

  const dragDrop = (e: React.DragEvent<HTMLImageElement>) => {
    setReplacedSquare(e.target as HTMLImageElement);
  };

  const dragEnd = (e: React.DragEvent<HTMLImageElement>) => {
    const squareBeingDraggedId: number = parseInt(draggedSquare?.getAttribute('data-id')!);
    const squareBeingReplacedId: number = parseInt(replacedSquare?.getAttribute('data-id')!);

    // currentColorArrangement[squareBeingReplacedId] = draggedSquare?.style.backgroundColor!;
    currentColorArrangement[squareBeingReplacedId] = draggedSquare?.getAttribute('src')!;
    currentColorArrangement[squareBeingDraggedId] = replacedSquare?.getAttribute('src')!;

    const validMoves = [squareBeingDraggedId - 1, squareBeingDraggedId - width, squareBeingDraggedId + 1, squareBeingDraggedId + width];

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isColumnOfFour = checkForColumnOfFour();
    const isColumnOfThree = checkForColumnOfThree();
    const isRowOfFour = checkForRowOfFour();
    const isRowOfThree = checkForRowOfThree();

    if (squareBeingReplacedId && validMove && (isColumnOfFour || isColumnOfThree || isRowOfFour || isRowOfThree)) {
      setDraggedSquare(null);
      setReplacedSquare(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] = replacedSquare?.getAttribute('src')!;
      currentColorArrangement[squareBeingDraggedId] = draggedSquare?.getAttribute('src')!;
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  };

  return (
    <div className="app">
      <ScoreBoard score={score} />
      <div className="game">
        {currentColorArrangement.map((candyColor, _i) => (
          <img
            key={_i}
            src={candyColor}
            alt={candyColor}
            data-id={_i}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()}
            onDragEnter={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()}
            onDragLeave={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
