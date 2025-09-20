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
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
import { FaVolumeUp, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdTranslate } from "react-icons/md";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import errorAnimation from "../../Assets/Error.json";
import { supabase } from "../../supabaseClient";
import GraphemeSplitter from "grapheme-splitter";

const splitter = new GraphemeSplitter();
const CAT_TO_INDEX = { vocal: 0, consonante: 1, tono: 2 };
const INDEX_TO_CAT = ["vocal", "consonante", "tono"];

function Character() {
  const navigate = useNavigate();
  const { letra } = useParams();
  const decodedLetter = decodeURIComponent(letra ?? "");

  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get("cat") ?? "vocal";
  const tabIndex = CAT_TO_INDEX[catParam] ?? 0;

  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const [allLetters, setAllLetters] = useState([]); // {id, letter, type}

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

  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const GROUP_ORDER = { V: 0, C: 1, T: 2 };
  const parseId = (id) => {
    const [grp, numStr] = String(id).split("-");
    const num = parseInt(numStr, 10);
    return {
      grp,
      num: Number.isFinite(num) ? num : Number.MAX_SAFE_INTEGER,
      groupRank: Object.prototype.hasOwnProperty.call(GROUP_ORDER, grp)
        ? GROUP_ORDER[grp]
        : 99,
    };
  };
  const sortLetters = (arr = []) =>
    [...arr].sort((a, b) => {
      const pa = parseId(a.id);
      const pb = parseId(b.id);
      if (pa.groupRank !== pb.groupRank) return pa.groupRank - pb.groupRank;
      return pa.num - pb.num;
    });

  useEffect(() => {
    const fetchLetters = async () => {
      const { data, error } = await supabase
        .from("Alfabeto")
        .select("id, letter, type");
      if (error || !data?.length) {
        setError("No se pudo cargar el alfabeto.");
        return;
      }
      setAllLetters(sortLetters(data));
    };
    fetchLetters();
  }, []);

  const lettersByCat = useMemo(() => {
    return allLetters
      .filter((l) =>
        catParam === "vocal"
          ? l.type === "vowel"
          : catParam === "consonante"
          ? l.type === "consonant"
          : l.type === "tone"
      )
      .map((l) => l.letter);
  }, [allLetters, catParam]);

  const currentIndex = useMemo(
    () => lettersByCat.findIndex((l) => l === decodedLetter),
    [lettersByCat, decodedLetter]
  );

  useEffect(() => {
    const fetchExamples = async () => {
      setLoading(true);
      setError(null);

      const currentMeta = allLetters.find((l) => l.letter === decodedLetter);
      if (!currentMeta) {
        setError(`No se encontró la letra: ${decodedLetter}`);
        setLoading(false);
        return;
      }

      const { data: examplesData, error: examplesError } = await supabase
        .from("Ejemplos")
        .select("id, word, audio, image, interpretation")
        .eq("letter_id", currentMeta.id);

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

    if (allLetters.length) {
      fetchExamples();
    }
  }, [decodedLetter, allLetters]);

  const handleImageLoad = (id) => {
    setImageLoaded((prev) => ({ ...prev, [id]: true }));
  };

  const goToIndex = useCallback(
    (idx) => {
      if (!lettersByCat.length) return;
      const wrapped =
        ((idx % lettersByCat.length) + lettersByCat.length) %
        lettersByCat.length;
      const nextLetter = lettersByCat[wrapped];
      navigate(`/caracter/${encodeURIComponent(nextLetter)}?cat=${catParam}`);
    },
    [lettersByCat, navigate, catParam]
  );

  const goPrev = useCallback(
    () => goToIndex(currentIndex - 1),
    [goToIndex, currentIndex]
  );
  const goNext = useCallback(
    () => goToIndex(currentIndex + 1),
    [goToIndex, currentIndex]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const handleTabChange = (i) => {
    const nextCat = INDEX_TO_CAT[i] ?? "vocal";
    setSearchParams({ cat: nextCat }, { replace: true });

    const newList = allLetters.filter((l) =>
      nextCat === "vocal"
        ? l.type === "vowel"
        : nextCat === "consonante"
        ? l.type === "consonant"
        : l.type === "tone"
    );
    const existsHere = newList.some((l) => l.letter === decodedLetter);
    if (!existsHere && newList.length) {
      navigate(
        `/caracter/${encodeURIComponent(newList[0].letter)}?cat=${nextCat}`
      );
    }
  };

  const handleInterpretation = (id) => {
    console.log("Ver interpretación de id:", id);
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
      bg="gray.50"
      userSelect="none"
    >
      {/* Caja BLANCA a pantalla completa */}
      <Box
        maxW="100%"
        mx="0"
        bg="white"
        borderRadius="0"
        boxShadow="none"
        borderWidth="0"
        minH="100vh"
        p={{ base: 4, md: 6 }}
      >
        {/* Tabs internos de categoría */}
        <Tabs
          align="center"
          variant="soft-rounded"
          colorScheme="blackAlpha"
          index={tabIndex}
          onChange={handleTabChange}
        >
          <TabList mb={4}>
            <Tab color="black" _selected={{ color: "white", bg: "#00C0F3" }}>
              Vocales
            </Tab>
            <Tab color="black" _selected={{ color: "white", bg: "#00C0F3" }}>
              Consonantes
            </Tab>
            <Tab color="black" _selected={{ color: "white", bg: "#00C0F3" }}>
              Tonos
            </Tab>
          </TabList>
        </Tabs>

        {/* Cabecera de la letra */}
        <Heading size="xl" mb={4} color="black" textAlign="center">
          {decodedLetter}
        </Heading>

        {/* Layout con flechas sticky + contenido */}
        <Flex gap={4}>
          {/* Flecha izquierda */}
          <Box
            position="sticky"
            top="calc(50vh - 28px)"
            alignSelf="flex-start"
            display={{ base: "none", md: "block" }}
          >
            <Tooltip label="Anterior" hasArrow>
              <IconButton
                aria-label="Anterior"
                icon={<FaChevronLeft />}
                colorScheme="cyan"
                variant="solid"
                onClick={goPrev}
                size="lg"
                borderRadius="full"
              />
            </Tooltip>
          </Box>

          {/* Contenido central */}
          <Box flex="1">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {examples.map((word) => (
                <Box
                  key={word.id}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
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
                      onLoad={() =>
                        setImageLoaded((prev) => ({ ...prev, [word.id]: true }))
                      }
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
          </Box>

          {/* Flecha derecha */}
          <Box
            position="sticky"
            top="calc(50vh - 28px)"
            alignSelf="flex-start"
            display={{ base: "none", md: "block" }}
          >
            <Tooltip label="Siguiente" hasArrow>
              <IconButton
                aria-label="Siguiente"
                icon={<FaChevronRight />}
                colorScheme="cyan"
                variant="solid"
                onClick={goNext}
                size="lg"
                borderRadius="full"
              />
            </Tooltip>
          </Box>
        </Flex>

        {/* Controles móviles (abajo) */}
        <Flex
          mt={6}
          gap={4}
          justify="center"
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            aria-label="Anterior"
            icon={<FaChevronLeft />}
            colorScheme="cyan"
            onClick={goPrev}
          />
          <IconButton
            aria-label="Siguiente"
            icon={<FaChevronRight />}
            colorScheme="cyan"
            onClick={goNext}
          />
        </Flex>
      </Box>
    </Box>
  );
}

export default Character;
