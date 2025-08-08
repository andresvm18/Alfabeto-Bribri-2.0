import React, { useState, useEffect } from "react";
import { Box, Text, SimpleGrid, Button, VStack } from "@chakra-ui/react";
import { toast } from "react-toastify";
import GraphemeSplitter from "grapheme-splitter";

function WordSearch({ words = [] }) {
  // Normalizar palabras a NFC y convertir a minúsculas
  const normalizedWords = words.map(w => w.normalize("NFC").trim().toLowerCase());

  // Instanciar GraphemeSplitter para separar caracteres visuales correctamente
  const splitter = new GraphemeSplitter();

  // Calcular tamaño del grid según la palabra más larga (en graphemes)
  const calculateGridSize = () => {
    if (normalizedWords.length === 0) return 10;
    const longestWordLength = Math.max(
      ...normalizedWords.map(word => splitter.countGraphemes(word))
    );
    return Math.min(Math.max(longestWordLength + 5, 10), 20);
  };

  const [gridSize, setGridSize] = useState(calculateGridSize());
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  // Alfabeto extendido en minúsculas (puedes agregar más caracteres si quieres)
  const alphabet = "abcdefghijklmnopqrstuvwxyzáéíóúüñ";

  useEffect(() => {
    const newGridSize = calculateGridSize();
    setGridSize(newGridSize);

    // Crear grid vacío (matriz 2D)
    let newGrid = Array(newGridSize)
      .fill(null)
      .map(() => Array(newGridSize).fill(null));

    // Colocar palabras en el grid usando graphemes
    normalizedWords.forEach((word) => {
      const graphemes = splitter.splitGraphemes(word);

      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        attempts++;
        const direction = Math.random() < 0.5 ? "horizontal" : "vertical";

        const maxRow = direction === "horizontal" ? newGridSize : newGridSize - graphemes.length;
        const maxCol = direction === "horizontal" ? newGridSize - graphemes.length : newGridSize;

        const startRow = Math.floor(Math.random() * maxRow);
        const startCol = Math.floor(Math.random() * maxCol);

        let canPlace = true;
        for (let i = 0; i < graphemes.length; i++) {
          const r = direction === "horizontal" ? startRow : startRow + i;
          const c = direction === "horizontal" ? startCol + i : startCol;

          if (newGrid[r][c] && newGrid[r][c] !== graphemes[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < graphemes.length; i++) {
            const r = direction === "horizontal" ? startRow : startRow + i;
            const c = direction === "horizontal" ? startCol + i : startCol;
            newGrid[r][c] = graphemes[i];
          }
          placed = true;
        }
      }
    });

    // Rellenar espacios vacíos con letras aleatorias del alfabeto
    for (let r = 0; r < newGridSize; r++) {
      for (let c = 0; c < newGridSize; c++) {
        if (!newGrid[r][c]) {
          newGrid[r][c] = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
      }
    }

    setGrid(newGrid);
    setSelectedCells([]);
    setFoundWords([]);
  }, [words]);

  // Manejar selección y deselección de celdas
  const toggleCellSelection = (row, col) => {
    if (foundWords.some(fw => fw.cells.some(([r, c]) => r === row && c === col))) {
      return;
    }

    const index = selectedCells.findIndex(([r, c]) => r === row && c === col);
    if (index !== -1) {
      setSelectedCells([...selectedCells.slice(0, index), ...selectedCells.slice(index + 1)]);
    } else {
      setSelectedCells([...selectedCells, [row, col]]);
    }
  };

  // Verificar palabra seleccionada
  const checkSelectedWord = () => {
    if (selectedCells.length === 0) {
      toast.info("Selecciona al menos una letra");
      return;
    }

    // Ordenar celdas
    const sortedCells = [...selectedCells].sort((a, b) => {
      if (a[0] === b[0]) return a[1] - b[1];
      return a[0] - b[0];
    });

    // Construir palabra seleccionada
    const selectedWord = sortedCells.map(([r, c]) => grid[r][c]).join("");
    const reversedWord = selectedWord.split("").reverse().join("");

    // Buscar en palabras normalizadas (graphemes ya están unidos en celdas)
    const foundWord = normalizedWords.find(
      w => w === selectedWord || w === reversedWord
    );

    if (foundWord && !foundWords.some(fw => fw.word === foundWord)) {
      setFoundWords([...foundWords, { word: foundWord, cells: sortedCells }]);
      setSelectedCells([]);
      toast.success(`¡${foundWord} encontrada! 🎉`);
    } else {
      toast.error(`¡${selectedWord} no está en la lista!`);
      setSelectedCells([]);
    }
  };

  // Helpers para estilos
  const isCellSelected = (row, col) =>
    selectedCells.some(([r, c]) => r === row && c === col);
  const isCellFound = (row, col) =>
    foundWords.some(fw => fw.cells.some(([r, c]) => r === row && c === col));

  return (
    <Box textAlign="center" p={6} userSelect="none">
      <Text fontSize="2xl" mb={6} fontWeight="bold">
        Sopa de Letras
      </Text>

      <Box
        mt={6}
        textAlign="center"
        maxW="600px"
        margin="auto"
        fontWeight="semibold"
        fontSize="lg"
        mb={4}
      >
        Palabras a buscar:{" "}
        {normalizedWords.map((word, idx) => (
          <span
            key={word}
            style={{
              textDecoration: foundWords.some(fw => fw.word === word)
                ? "line-through"
                : "none",
              color: foundWords.some(fw => fw.word === word)
                ? "green"
                : "black",
              marginRight: idx < normalizedWords.length - 1 ? "0.5rem" : "0",
            }}
          >
            {word}
          </span>
        ))}
      </Box>

      <SimpleGrid
        columns={gridSize}
        spacing={1}
        justifyContent="center"
        maxW="600px"
        margin="auto"
        userSelect="none"
      >
        {grid.map((row, r) =>
          row.map((letter, c) => (
            <Box
              key={`${r}-${c}`}
              border="1px solid #999"
              lineHeight="40px"
              height="40px"
              fontSize="lg"
              fontWeight="bold"
              color={isCellFound(r, c) ? "green" : "#333"}
              bg={
                isCellSelected(r, c)
                  ? "#00C0F3"
                  : isCellFound(r, c)
                  ? "#d4f5d4"
                  : "white"
              }
              cursor={isCellFound(r, c) ? "default" : "pointer"}
              onClick={() => toggleCellSelection(r, c)}
              transition="background-color 0.3s ease"
            >
              {letter}
            </Box>
          ))
        )}
      </SimpleGrid>

      <VStack mt={6}>
        <Button
          colorScheme="blue"
          size="md"
          onClick={checkSelectedWord}
          isDisabled={selectedCells.length === 0}
        >
          Verificar palabra
        </Button>
      </VStack>
    </Box>
  );
}

export default WordSearch;
