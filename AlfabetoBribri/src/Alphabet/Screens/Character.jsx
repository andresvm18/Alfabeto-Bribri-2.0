import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Image,
  Text,
  Button,
  Flex,
  SimpleGrid,
  Icon,
  IconButton,
  Spinner,
  chakra,
  Tooltip,
} from "@chakra-ui/react";
import { FaVolumeUp, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdTranslate } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import errorAnimation from "../../Assets/Error.json";
import { supabase } from "../../supabaseClient";
import GraphemeSplitter from "grapheme-splitter";

const splitter = new GraphemeSplitter();

function Character() {
  const navigate = useNavigate();
  const { letra } = useParams();
  const decodedLetter = decodeURIComponent(letra ?? "");
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const [lettersList, setLettersList] = useState([]);

  const normalizeChar = (char) =>
    char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const renderHighlightedWord = (word) => {
    const prefix = "seˈ";
    const normalizedWord = normalizeChar(word);
    const normalizedLetter = normalizeChar(decodedLetter);

    if (normalizedWord.startsWith(normalizeChar(prefix))) {
      return (
        <>
          <chakra.span fontWeight="normal" fontSize="xl" color="gray.400">
            {word.slice(0, 3)}
          </chakra.span>
          {splitter.splitGraphemes(word.slice(3)).map((grapheme, i) => (
            <chakra.span
              key={i}
              fontWeight={
                normalizeChar(grapheme) === normalizedLetter ? "bold" : "normal"
              }
              fontSize="xl"
              color="black"
            >
              {grapheme}
            </chakra.span>
          ))}
        </>
      );
    }

    return splitter.splitGraphemes(word).map((grapheme, i) => (
      <chakra.span
        key={i}
        fontWeight={
          normalizeChar(grapheme) === normalizedLetter ? "bold" : "normal"
        }
        fontSize="xl"
        color="black"
      >
        {grapheme}
      </chakra.span>
    ));
  };

  const playAudio = (audioUrl) => {
    new Audio(audioUrl).play();
  };

  const currentIndex = useMemo(
    () => lettersList.findIndex((l) => l === decodedLetter),
    [lettersList, decodedLetter]
  );

  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };


  const goToIndex = useCallback(
    (idx) => {
      if (!lettersList.length) return;
      const wrapped =
        ((idx % lettersList.length) + lettersList.length) % lettersList.length;
      const nextLetter = lettersList[wrapped];

      console.log(
        `[Nav] de "${decodedLetter}" (idx ${currentIndex}) -> "${nextLetter}" (idx ${wrapped})`
      );

      navigate(`/caracter/${encodeURIComponent(nextLetter)}`);
    },
    [lettersList, navigate, decodedLetter, currentIndex]
  );

  const goPrev = useCallback(() => goToIndex(currentIndex - 1), [goToIndex, currentIndex]);
  const goNext = useCallback(() => goToIndex(currentIndex + 1), [goToIndex, currentIndex]);

  // Teclas de flecha para navegar
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        console.log("[Key] ArrowLeft");
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        console.log("[Key] ArrowRight");
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  // Log de letra actual e índice cada vez que cambian
  useEffect(() => {
    if (lettersList.length) {
      console.log(
        `[Alfabeto] letra actual: "${decodedLetter}" (index ${currentIndex} de ${lettersList.length})`
      );
    }
  }, [decodedLetter, currentIndex, lettersList]);

  // --- Funciones de ordenamiento por grupo y número ---
  const GROUP_ORDER = { V: 0, C: 1, T: 2 }; // Prioridad: Vocales, Consonantes, Tonos
  const parseId = (id) => {
    const [grp, numStr] = String(id).split("-");
    const num = parseInt(numStr, 10);
    return {
      grp,
      num: Number.isFinite(num) ? num : Number.MAX_SAFE_INTEGER,
      groupRank: GROUP_ORDER.hasOwnProperty(grp) ? GROUP_ORDER[grp] : 99,
    };
  };
  const sortLetters = (arr) =>
    [...arr].sort((a, b) => {
      const pa = parseId(a.id);
      const pb = parseId(b.id);
      if (pa.groupRank !== pb.groupRank) return pa.groupRank - pb.groupRank;
      return pa.num - pb.num;
    });

  // Cargar lista de letras + ejemplos de la letra actual (y ordenar)
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      const { data: lettersData, error: lettersErr } = await supabase
        .from("Alfabeto")
        .select("id, letter");

      console.log(
        "[Alfabeto] recibido (crudo):",
        lettersData?.map((l) => ({ id: l.id, letter: l.letter })) ?? []
      );

      if (lettersErr || !lettersData?.length) {
        setError("No se pudo cargar el alfabeto.");
        setLoading(false);
        return;
      }

      const sorted = sortLetters(lettersData);
      console.log(
        "[Alfabeto] ordenado (V->C->T y num):",
        sorted.map((l) => ({ id: l.id, letter: l.letter }))
      );

      const onlyLetters = sorted.map((l) => l.letter);
      console.log("[Alfabeto] lettersList (UI):", onlyLetters);
      setLettersList(onlyLetters);

      const current = sorted.find((l) => l.letter === decodedLetter);
      if (!current) {
        setError(`No se encontró la letra: ${decodedLetter}`);
        setLoading(false);
        return;
      }

      const { data: examplesData, error: examplesError } = await supabase
        .from("Ejemplos")
        .select("id, word, audio, image, interpretation")
        .eq("letter_id", current.id);

      if (examplesError) {
        setError("Error al obtener ejemplos.");
        setLoading(false);
        return;
      }

      if (!examplesData || examplesData.length === 0) {
        setError(`No hay ejemplos para la letra: ${decodedLetter}`);
        setLoading(false);
        return;
      }

      setExamples(examplesData);
      setLoading(false);
    };

    fetchAll();
  }, [decodedLetter]);

  const handleImageLoad = (id) => {
    setImageLoaded((prev) => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        w="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
        userSelect="none"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="#00C0F3"
          size="xl"
          mb={4}
        />
        <Heading as="h2" size="md" color="black">
          Cargando...
        </Heading>
      </Box>
    );
  }

  if (error) {
    return (
      <Flex
        direction="column"
        justify="center"
        align="center"
        minH="100vh"
        textAlign="center"
        p={4}
      >
        <Box boxSize="200px">
          <Lottie animationData={errorAnimation} loop />
        </Box>
        <Heading size="md" color="red.500" mt={4}>
          {error}
        </Heading>
      </Flex>
    );
  }

  return (
    <Box
      minH="100vh"
      w="100%"
      p={6}
      textAlign="center"
      display="flex"
      flexDirection="column"
      userSelect={"none"}
      position="relative"
    >
      {/* Flechas flotantes */}
      {lettersList.length > 0 && currentIndex >= 0 && (
        <>
          <Tooltip label="Anterior" hasArrow>
            <IconButton
              aria-label="Anterior"
              icon={<FaChevronLeft />}
              position="fixed"
              left={{ base: 2, md: 6 }}
              top="50%"
              transform="translateY(-50%)"
              zIndex={20}
              colorScheme="cyan"
              variant="solid"
              onClick={goPrev}
              size="lg"
              borderRadius="full"
            />
          </Tooltip>
          <Tooltip label="Siguiente" hasArrow>
            <IconButton
              aria-label="Siguiente"
              icon={<FaChevronRight />}
              position="fixed"
              right={{ base: 2, md: 6 }}
              top="50%"
              transform="translateY(-50%)"
              zIndex={20}
              colorScheme="cyan"
              variant="solid"
              onClick={goNext}
              size="lg"
              borderRadius="full"
            />
          </Tooltip>
        </>
      )}

      <Heading size="xl" mb={4} color="black">
        {decodedLetter}
      </Heading>

      <Flex flex="1" direction="column" justifyContent="center">
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={6}
          maxW="1200px"
          mx="auto"
          width="100%"
        >
          {examples.map((word) => (
            <Box
              key={word.id}
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              overflow="hidden"
              borderWidth="1px"
              borderColor="#00C0F3"
              height="100%"
              display="flex"
              flexDirection="column"
            >
              <Box display="flex" justifyContent="flex-end" p={2}>
                <Tooltip label={capitalizeFirst(word.interpretation)} hasArrow>
                  <IconButton
                    aria-label="Ver interpretación"
                    icon={<MdTranslate />}
                    variant="ghost"
                    colorScheme="cyan"
                    size="md"
                    onClick={() => handleInterpretation(word.id)}
                  />
                </Tooltip>
              </Box>
              <Box
                bg="white"
                flex="1"
                position="relative"
                minH="250px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={word.image}
                  alt={`Imagen de ${word.word}`}
                  width="80%"
                  height="80%"
                  objectFit="contain"
                  borderRadius="md"
                  bg="white"
                  opacity={imageLoaded[word.id] ? 1 : 0}
                  transition="opacity 0.5s ease-in-out"
                  onLoad={() => handleImageLoad(word.id)}
                />
              </Box>

              <Box p={4}>
                <Flex align="center" justify="center" mb={3}>
                  <Text color="black" lineHeight="1">
                    {renderHighlightedWord(word.word)}
                  </Text>
                </Flex>

                <Button
                  bg="#00C0F3"
                  _hover={{ bg: "#00A8D9", transform: "scale(1.05)" }}
                  color="white"
                  size="lg"
                  height="50px"
                  onClick={() => playAudio(word.audio)}
                  leftIcon={<Icon as={FaVolumeUp} boxSize={5} />}
                  width="100%"
                  fontSize="lg"
                >
                  Escuchar
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
}

export default Character;
