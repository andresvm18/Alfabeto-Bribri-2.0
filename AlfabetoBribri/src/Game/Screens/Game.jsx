import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Confetti from "react-confetti";
import {
  Box,
  VStack,
  Heading,
  Button,
  Text,
  Progress,
  Container,
  Badge,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { FaTrophy, FaFont, FaGamepad } from "react-icons/fa";
import QuestionDisplay from "../Components/QuestionDisplay";
import OptionsList from "../Components/OptionsList";
import WordSearch from "../Components/WordSearch";
import { supabase } from "../../supabaseClient";

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

async function fetchQuestions(gameMode) {
  // Obtiene las preguntas desde Supabase
  let { data: Ejemplos, error } = await supabase
    .from("Ejemplos")
    .select("word, audio, image");

  if (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
  if (!Ejemplos || Ejemplos.length === 0) {
    console.warn("No questions found for game mode:", gameMode);
    return [];
  }

  const shuffled = Ejemplos.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 10);

  const questions = selected.map((correctItem) => {
    const incorrectOptions = Ejemplos
      .filter((item) => item.word !== correctItem.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((item) => item.word);

    let type = "image";
    let source = correctItem.image;
    if (gameMode === "modo2") {
      type = "audio";
      source = correctItem.audio;
    } else if (gameMode === "modo3") {
      if (Math.random() > 0.5) {
        type = "image";
        source = correctItem.image;
      } else {
        type = "audio";
        source = correctItem.audio;
      }
    }

    return {
      type,
      source,
      instructions:
        type === "image"
          ? "Selecciona la palabra correcta para la imagen."
          : "Escucha el audio y selecciona la palabra correcta.",
      options: shuffleArray([correctItem.word, ...incorrectOptions]),
      correctAnswer: correctItem.word,
    };
  });

  return questions;
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function GamePage() {
  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage === 0) return "red.500";
    if (percentage >= 80) return "green.500";
    if (percentage >= 60) return "yellow.500";
    return "red.500";
  };

  const getScoreMessage = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "¡Excelente trabajo! 🎉";
    if (percentage >= 60) return "¡Buen trabajo! 👍";
    return "Sigue practicando 💪";
  };

  const { gameMode } = useParams();
  const { width, height } = useWindowSize();

  // Estados para sopa de letras (modo4)
  const [words, setWords] = useState([]);
  const [loadingWords, setLoadingWords] = useState(true);

  // Estados para preguntas (modo1, 2, 3)
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Cargar sopa de letras si modo4
  useEffect(() => {
    if (gameMode === "modo4") {
      async function loadWords() {
        setLoadingWords(true);
        let { data, error } = await supabase.from("Ejemplos").select("word");
        if (error) {
          console.error("Error fetching words for wordsearch:", error);
          setWords([]);
        } else {
          const w = data
            .map((item) => item.word.toUpperCase())
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);
          setWords(w);
        }
        setLoadingWords(false);
      }
      loadWords();
    }
  }, [gameMode]);

  // Cargar preguntas para otros modos
  useEffect(() => {
    if (gameMode !== "modo4") {
      async function loadQuestions() {
        setLoading(true);
        const q = await fetchQuestions(gameMode);
        setQuestions(q);
        setCurrentIndex(0);
        setScore(0);
        setShowFeedback(false);
        setIsCorrect(null);
        setShowConfetti(false);
        setLoading(false);
      }
      loadQuestions();
    }
  }, [gameMode]);

  // Modo 4: mostrar sopa de letras
  if (gameMode === "modo4") {
    if (loadingWords) {
      return (
        <Container minH="100vh" centerContent justifyContent="center">
          <VStack spacing={6}>
            <Box
              p={8}
              borderRadius="2xl"
              bg="white"
              boxShadow="xl"
              textAlign="center"
            >
              <Heading size="lg" color="gray.600">
                Cargando sopa de letras...
              </Heading>
              <Progress
                size="lg"
                isIndeterminate
                colorScheme="blue"
                mt={6}
                borderRadius="full"
              />
            </Box>
          </VStack>
        </Container>
      );
    }
    return <WordSearch words={words} gridSize={12} />;
  }

  if (loading) {
    return (
      <Container minH="100vh" centerContent justifyContent="center">
        <VStack spacing={6}>
          <Box
            p={8}
            borderRadius="2xl"
            bg="white"
            boxShadow="xl"
            textAlign="center"
          >
            <Heading size="lg" color="gray.600">
              Cargando preguntas...
            </Heading>
            <Progress
              size="lg"
              isIndeterminate
              colorScheme="blue"
              mt={6}
              borderRadius="full"
            />
          </Box>
        </VStack>
      </Container>
    );
  }

  if (currentIndex >= questions.length) {
    return (
      <Box
        minH="100vh"
        bg="linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%)"
        py={20}
        px={4}
        userSelect="none"
      >
        <Container maxW="lg" centerContent>
          <Box
            bg="white"
            borderRadius="3xl"
            boxShadow="2xl"
            border={"1px solid"}
            borderColor="gray.200"
            p={12}
            textAlign="center"
            transform="scale(1)"
          >
            <VStack spacing={8}>
              <Icon as={FaTrophy} boxSize={16} color="gold" />

              <Heading size="2xl" color="gray.700">
                ¡Juego terminado!
              </Heading>

              <Box>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  gap={4}
                  mb={4}
                >
                  <Text fontSize="2xl" fontWeight="bold" color="gray.600">
                    Puntuación:
                  </Text>
                  <Badge
                    fontSize="2xl"
                    px={6}
                    py={2}
                    borderRadius="full"
                    colorScheme={score >= questions.length * 0.7 ? "green" : "red"}
                    variant="solid"
                  >
                    {score} / {questions.length}
                  </Badge>
                </Flex>

                <Progress
                  value={(score / questions.length) * 100}
                  size="lg"
                  colorScheme={score >= questions.length * 0.7 ? "green" : "red"}
                  borderRadius="full"
                  bg="gray.100"
                  mb={6}
                />
              </Box>

              <Text
                fontSize="xl"
                color={getScoreColor(score, questions.length)}
                fontWeight="semibold"
              >
                {getScoreMessage(score, questions.length)}
              </Text>

              <Text color="gray.600" fontSize="md" maxW="md">
                {score >= questions.length * 0.7
                  ? "¡Sigue así! Tu conocimiento es impresionante."
                  : "No te desanimes, cada intento te hace mejor. ¡Inténtalo de nuevo!"}
              </Text>

              <Button
                bg="#00C0F3"
                color="white"
                size="lg"
                minW="280px"
                px={12}
                py={6}
                borderRadius="full"
                fontSize="lg"
                fontWeight="bold"
                leftIcon={<Icon as={FaFont} />} 
                _hover={{
                  bg: "#0099CC",
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s ease"
                onClick={() => window.location.href = "/alfabeto"}
              >
                Alfabeto
              </Button>

              <Button
                bg="#FF6347"
                color="white"
                size="lg"
                minW="280px"
                px={12}
                py={6}
                borderRadius="full"
                fontSize="lg"
                fontWeight="bold"
                leftIcon={<Icon as={FaGamepad} />}
                onClick={() => (window.location.href = "/aprende")}
                _hover={{
                  bg: "#FF4500",
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s ease"
              >
                Menú de juegos
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (isCorrectAnswer) => {
    setIsCorrect(isCorrectAnswer);
    setShowFeedback(true);

    if (isCorrectAnswer) {
      setScore((prev) => prev + 1);
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowFeedback(false);
      setIsCorrect(null);
      setShowConfetti(false);
    } else {
      setCurrentIndex(questions.length);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
      py={8}
      px={4}
      position="relative"
      overflow="hidden"
    >
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.3}
          initialVelocityX={{ min: -10, max: 10 }}
          initialVelocityY={{ min: -10, max: 10 }}
        />
      )}

      <Container maxW="4xl">
        <VStack spacing={8}>
          <Box
            w="full"
            bg="white"
            borderRadius="2xl"
            p={4}
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
          >
            <VStack spacing={2} userSelect="none">
              <Flex w="full" justifyContent="space-between" alignItems="center">
                <Heading size="md" color="gray.700">
                  Pregunta {currentIndex + 1} de {questions.length}
                </Heading>
                <Badge
                  colorScheme="blue"
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  Puntos: {score}
                </Badge>
              </Flex>

              <Box w="full">
                <Progress
                  value={((currentIndex + 1) / questions.length) * 100}
                  size="sm"
                  colorScheme="blue"
                  borderRadius="full"
                  bg="gray.100"
                  transition="all 0.3s ease"
                />
                <Text fontSize="xs" color="gray.500" textAlign="center" mt={1}>
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                  completado
                </Text>
              </Box>
            </VStack>
          </Box>

          <Box
            w="full"
            bg="white"
            borderRadius="2xl"
            p={8}
            boxShadow="xl"
            border="1px solid"
            borderColor="gray.100"
            transition="all 0.3s ease"
            _hover={{ boxShadow: "2xl" }}
          >
            <VStack spacing={8}>
              <QuestionDisplay
                type={currentQuestion.type}
                source={currentQuestion.source}
                instructions={currentQuestion.instructions}
              />

              <OptionsList
                options={currentQuestion.options}
                correctAnswer={currentQuestion.correctAnswer}
                onAnswer={handleAnswer}
                disabled={showFeedback}
              />

              {showFeedback && (
                <Box textAlign="center">
                  <Button
                    bg="#00C0F3"
                    color="white"
                    size="lg"
                    px={12}
                    py={6}
                    borderRadius="full"
                    fontSize="lg"
                    fontWeight="bold"
                    _hover={{
                      bg: "#0099CC",
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s ease"
                    onClick={handleNext}
                  >
                    {currentIndex < questions.length - 1
                      ? "Siguiente pregunta"
                      : "Ver resultados"}
                  </Button>
                </Box>
              )}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default GamePage;