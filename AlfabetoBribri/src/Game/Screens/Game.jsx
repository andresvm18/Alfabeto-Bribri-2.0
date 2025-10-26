import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  VStack,
  Heading,
  Button,
  Text,
  Container,
  Icon,
  Flex,
  Badge,
  Progress,
} from "@chakra-ui/react";
import { FaFont, FaGamepad, FaArrowRight } from "react-icons/fa";
import QuestionDisplay from "../Components/QuestionDisplay";
import OptionsList from "../Components/OptionsList";
import { supabase } from "../../supabaseClient";

async function fetchQuestions(gameMode) {
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
  const { gameMode } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

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
        setLoading(false);
      }
      loadQuestions();
    }
  }, [gameMode]);

  // Scroll al inicio cuando cambia la pregunta
  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentIndex, loading]);

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

  // Pantalla final (resultado)
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
          >
            <VStack spacing={8}>
              {/* Resultado numérico (sin título ni emoji) */}
              <Flex alignItems="center" justifyContent="center" gap={4} mb={4}>
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

              {/* Barra de porcentaje (opcional, sin texto motivacional) */}
              <Progress
                value={(score / questions.length) * 100}
                size="lg"
                colorScheme={score >= questions.length * 0.7 ? "green" : "red"}
                borderRadius="full"
                bg="gray.100"
                mb={0}
              />

              {/* Botones */}
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
                onClick={() => (window.location.href = "/alfabeto")}
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
                Práctica
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

  // Pantalla del juego (preguntas)
  const currentQuestion = questions[currentIndex];

  const handleAnswer = (isCorrectAnswer) => {
    setIsCorrect(isCorrectAnswer);
    setShowFeedback(true);

    if (isCorrectAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowFeedback(false);
      setIsCorrect(null);
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
      <Container maxW="4xl">
        <VStack spacing={8}>
          <Box
            w="full"
            bg="white"
            borderRadius="2xl"
            p={8}
            boxShadow="xl"
            border="1px solid"
            borderColor="gray.100"
            transition="all 0.2s ease"
            _hover={{ boxShadow: "2xl" }}
          >
            <VStack spacing={8}>
              <QuestionDisplay
                type={currentQuestion.type}
                source={currentQuestion.source}
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
                    rightIcon={
                      currentIndex < questions.length - 1 ? (
                        <Icon as={FaArrowRight} boxSize={5} />
                      ) : undefined
                    }
                    _hover={{
                      bg: "#0099CC",
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s ease"
                    onClick={handleNext}
                  >
                    {currentIndex < questions.length - 1 ? "" : "Ver resultados"}
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
