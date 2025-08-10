import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  SimpleGrid,
  Button,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import GraphemeSplitter from "grapheme-splitter";
import { FaFont, FaGamepad } from "react-icons/fa";

function WordSearch({ words = [] }) {
  const navigate = useNavigate();

  // Normalizar palabras a NFC y convertir a minúsculas
  const normalizedWords = words
    .map((w) => w.split("/")[0].normalize("NFC").trim().toLowerCase());


  const splitter = new GraphemeSplitter();

  const calculateGridSize = () => {
    if (normalizedWords.length === 0) return 10;
    const longestWordLength = Math.max(
      ...normalizedWords.map((word) => splitter.countGraphemes(word))
    );
    return Math.min(Math.max(longestWordLength + 5, 10), 20);
  };

  const [gridSize, setGridSize] = useState(calculateGridSize());
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const alphabet = "abcdefghijklmnopqrstuvwxyzáéíóúüñ";

  useEffect(() => {
    const newGridSize = calculateGridSize();
    setGridSize(newGridSize);

    let newGrid = Array(newGridSize)
      .fill(null)
      .map(() => Array(newGridSize).fill(null));

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

  useEffect(() => {
    if (normalizedWords.length > 0 && foundWords.length === normalizedWords.length) {
      onOpen();
    }
  }, [foundWords, normalizedWords.length, onOpen]);

  const toggleCellSelection = (row, col) => {
    if (foundWords.some((fw) => fw.cells.some(([r, c]) => r === row && c === col))) {
      return;
    }

    const index = selectedCells.findIndex(([r, c]) => r === row && c === col);
    if (index !== -1) {
      setSelectedCells([...selectedCells.slice(0, index), ...selectedCells.slice(index + 1)]);
    } else {
      setSelectedCells([...selectedCells, [row, col]]);
    }
  };

  const checkSelectedWord = () => {
    if (selectedCells.length === 0) {
      toast.info("Selecciona al menos una letra");
      return;
    }

    const sortedCells = [...selectedCells].sort((a, b) => {
      if (a[0] === b[0]) return a[1] - b[1];
      return a[0] - b[0];
    });

    const selectedWord = sortedCells.map(([r, c]) => grid[r][c]).join("");
    const reversedWord = selectedWord.split("").reverse().join("");

    const foundWord = normalizedWords.find((w) => w === selectedWord || w === reversedWord);

    if (foundWord && !foundWords.some((fw) => fw.word === foundWord)) {
      setFoundWords([...foundWords, { word: foundWord, cells: sortedCells }]);
      setSelectedCells([]);
      toast.success(`¡${foundWord} encontrada! 🎉`);
    } else {
      toast.error(`¡${selectedWord} no está en la lista!`);
      setSelectedCells([]);
    }
  };

  const isCellSelected = (row, col) =>
    selectedCells.some(([r, c]) => r === row && c === col);
  const isCellFound = (row, col) =>
    foundWords.some((fw) => fw.cells.some(([r, c]) => r === row && c === col));

  return (
    <Box
      maxW="700px"
      mx="auto"
      p={6}
      userSelect="none"
      textAlign="center"
      fontFamily="body"
    >
      <Text fontSize="3xl" mb={6} fontWeight="extrabold" color="#00C0F3" letterSpacing="wide">
        Sopa de Letras
      </Text>

      <Box
        mb={6}
        fontWeight="semibold"
        fontSize={{ base: "md", md: "lg" }}
        maxW="600px"
        mx="auto"
      >
        Palabras a buscar:{" "}
        {normalizedWords.map((word, idx) => (
          <Box
            key={word}
            as="span"
            display="inline-block"
            mr={idx < normalizedWords.length - 1 ? 2 : 0}
            px={2}
            py={1}
            borderRadius="md"
            bg={foundWords.some((fw) => fw.word === word) ? "green.100" : "gray.100"}
            color={foundWords.some((fw) => fw.word === word) ? "green.600" : "gray.700"}
            textDecoration={foundWords.some((fw) => fw.word === word) ? "line-through" : "none"}
            transition="all 0.3s ease"
            userSelect="none"
          >
            {word}
          </Box>
        ))}
      </Box>

      <SimpleGrid
        columns={gridSize}
        spacing={1}
        justifyContent="center"
        maxW="600px"
        mx="auto"
        userSelect="none"
        border="2px solid #00C0F3"
        borderRadius="2xl"
        boxShadow="inner"
        p={2}
        bg="gray.50"
      >
        {grid.map((row, r) =>
          row.map((letter, c) => (
            <Box
              key={`${r}-${c}`}
              borderRadius="md"
              lineHeight="40px"
              height="40px"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              color={isCellFound(r, c) ? "green.600" : "#333"}
              bg={
                isCellSelected(r, c)
                  ? "#00C0F3"
                  : isCellFound(r, c)
                    ? "green.100"
                    : "white"
              }
              cursor={isCellFound(r, c) ? "default" : "pointer"}
              userSelect="none"
              border="1px solid"
              borderColor={isCellSelected(r, c) ? "#0099CC" : "gray.300"}
              transition="all 0.3s ease"
              _hover={
                !isCellFound(r, c)
                  ? { bg: "#b2e7ff", borderColor: "#00AFFF", transform: "scale(1.1)" }
                  : {}
              }
              onClick={() => toggleCellSelection(r, c)}
            >
              {letter}
            </Box>
          ))
        )}
      </SimpleGrid>

      <VStack mt={6} spacing={4}>
        <Button
          colorScheme="blue"
          size="md"
          onClick={checkSelectedWord}
          isDisabled={selectedCells.length === 0}
          fontWeight="bold"
          px={8}
          py={6}
          borderRadius="full"
          boxShadow="lg"
          _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
          transition="all 0.2s ease"
        >
          Verificar palabra
        </Button>
      </VStack>

      {/* Modal de felicitaciones */}
      {/* Modal de felicitaciones */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          bg="white"
          borderRadius="3xl"
          boxShadow="2xl"
          maxW="400px"
          mx="auto"
        >
          <ModalHeader
            fontWeight="extrabold"
            color="#00C0F3"
            textAlign="center"
            fontSize={{ base: "2xl", md: "3xl" }}
            pt={6}
          >
            ¡Felicidades!
          </ModalHeader>

          <ModalBody
            fontWeight="semibold"
            fontSize={{ base: "md", md: "lg" }}
            textAlign="center"
            color="gray.700"
            pb={6}
          >
            Has encontrado todas las palabras
          </ModalBody>

          <ModalFooter justifyContent="center" gap={6} pb={8} pt={0}>
            <Button
              leftIcon={<FaFont />}
              bg="#00C0F3"
              color="white"
              size="lg"
              minW="140px"
              px={8}
              py={4}
              borderRadius="full"
              fontWeight="bold"
              _hover={{
                bg: "#0099CC",
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s ease"
              onClick={() => navigate("/alfabeto")}
            >
              Alfabeto
            </Button>

            <Button
              leftIcon={<FaGamepad />}
              bg="gray.300"
              color="gray.800"
              size="lg"
              minW="140px"
              px={8}
              py={4}
              borderRadius="full"
              fontWeight="medium"
              _hover={{
                bg: "gray.400",
                transform: "translateY(-2px)",
                boxShadow: "md",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s ease"
              onClick={() => navigate("/aprende")}
            >
              Volver al menú
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>



      {/* Animaciones CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </Box>
  );
}

export default WordSearch;
