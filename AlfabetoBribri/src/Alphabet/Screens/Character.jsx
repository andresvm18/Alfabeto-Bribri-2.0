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

  const [searchParams] = useSearchParams();
  const rawCat = searchParams.get("cat");
  const catParam = (rawCat && rawCat in CAT_TO_INDEX) ? rawCat : "vocal";
  const tabIndex = CAT_TO_INDEX[catParam];

  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const [allLetters, setAllLetters] = useState([]);

  // Normaliza ?cat (si entra inválido) para que tabIndex sea consistente
  useEffect(() => {
    if (!rawCat || !(rawCat in CAT_TO_INDEX)) {
      // Redirige a la misma letra pero con cat normalizado
      navigate(`/caracter/${encodeURIComponent(decodedLetter)}?cat=${catParam}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawCat, decodedLetter]);

  const normalizeChar = (char) =>
    char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const renderHighlightedWord = (word) => {
    const prefix = "seˈ";
    const normalizedWord = normalizeChar(word);
    const normalizedLetter = normalizeChar(decodedLetter);

    if (normalizedWord.startsWith(normalizeChar(prefix))) {
      return (
        <>
          <chakra.span fontWeight="normal" fontSize="lg" color="gray.400">
            {word.slice(0, 3)}
          </chakra.span>
          {splitter.splitGraphemes(word.slice(3)).map((grapheme, i) => (
            <chakra.span
              key={i}
              fontWeight={
                normalizeChar(grapheme) === normalizedLetter ? "bold" : "normal"
              }
              fontSize="lg"
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
        fontSize="lg"
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

  // Al cambiar de tab aquí, redirige al menú de alfabeto con la categoría elegida.
  const handleTabChange = (i) => {
    const nextCat = INDEX_TO_CAT[i] ?? "vocal";
    navigate(`/alfabeto?cat=${nextCat}`);
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
        p={{ base: 3, md: 6 }}
      >
        <Spinner
          thickness={{ base: "3px", md: "4px" }}
          speed="0.65s"
          emptyColor="gray.200"
          color="#00C0F3"
          size={{ base: "lg", md: "xl" }}
          mb={{ base: 3, md: 4 }}
        />
        <Heading as="h2" size={{ base: "sm", md: "md" }} color="black">
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
        p={{ base: 4, md: 8 }}
      >
        <Box boxSize={{ base: "160px", md: "220px" }}>
          <Lottie animationData={errorAnimation} loop />
        </Box>
        <Heading size={{ base: "sm", md: "md" }} color="red.500" mt={{ base: 3, md: 4 }}>
          {error}
        </Heading>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" w="100%" bg="gray.50" userSelect="none">
      <Box
        maxW="100%"
        mx="0"
        bg="white"
        borderRadius="0"
        boxShadow="none"
        borderWidth="0"
        minH="100vh"
        p={{ base: 3, md: 6 }}
      >
        <Tabs
          align="center"
          variant="soft-rounded"
          colorScheme="blackAlpha"
          index={tabIndex}
          onChange={handleTabChange}
        >
          <TabList mb={{ base: 3, md: 4 }}>
            <Tab
              color="black"
              _selected={{ color: "white", bg: "#00C0F3" }}
              fontSize={{ base: "sm", md: "md" }}
              py={{ base: 1, md: 2 }}
              px={{ base: 3, md: 4 }}
            >
              Vocales
            </Tab>
            <Tab
              color="black"
              _selected={{ color: "white", bg: "#00C0F3" }}
              fontSize={{ base: "sm", md: "md" }}
              py={{ base: 1, md: 2 }}
              px={{ base: 3, md: 4 }}
            >
              Consonantes
            </Tab>
            <Tab
              color="black"
              _selected={{ color: "white", bg: "#00C0F3" }}
              fontSize={{ base: "sm", md: "md" }}
              py={{ base: 1, md: 2 }}
              px={{ base: 3, md: 4 }}
            >
              Tonos
            </Tab>
          </TabList>
        </Tabs>

        <Heading size={{ base: "lg", md: "xl" }} mb={{ base: 3, md: 5 }} color="black" textAlign="center">
          {decodedLetter}
        </Heading>

        <Flex gap={{ base: 3, md: 4 }}>
          <Box
            position="sticky"
            top={{ base: "calc(50vh - 24px)", md: "calc(50vh - 28px)" }}
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
                size={{ base: "md", md: "lg" }}
                borderRadius="full"
              />
            </Tooltip>
          </Box>

          <Box flex="1">
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 4, md: 6 }}>
              {examples.map((word) => (
                <Box
                  key={word.id}
                  bg="white"
                  borderRadius={{ base: "lg", md: "xl" }}
                  boxShadow={{ base: "sm", md: "md" }}
                  overflow="hidden"
                  borderWidth="1px"
                  borderColor="#00C0F3"
                  height="100%"
                  display="flex"
                  flexDirection="column"
                >
                  <Box display="flex" justifyContent="flex-end" p={{ base: 2, md: 3 }}>
                    <Tooltip label={capitalizeFirst(word.interpretation)} hasArrow>
                      <IconButton
                        aria-label="Ver interpretación"
                        icon={<MdTranslate />}
                        variant="ghost"
                        colorScheme="cyan"
                        size={{ base: "sm", md: "md" }}
                        onClick={() => console.log("Ver interpretación de id:", word.id)}
                      />
                    </Tooltip>
                  </Box>

                  <Box
                    bg="white"
                    flex="1"
                    position="relative"
                    minH={{ base: "180px", md: "220px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    px={{ base: 2, md: 4 }}
                  >
                    <Image
                      src={word.image}
                      alt={`Imagen de ${word.word}`}
                      width={{ base: "70%", md: "85%" }}
                      height={{ base: "70%", md: "85%" }}
                      objectFit="contain"
                      borderRadius={{ base: "md", md: "lg" }}
                      bg="white"
                      opacity={imageLoaded[word.id] ? 1 : 0}
                      transition="opacity 0.4s ease-in-out"
                      onLoad={() =>
                        setImageLoaded((prev) => ({ ...prev, [word.id]: true }))
                      }
                    />
                  </Box>

                  <Box p={{ base: 3, md: 4 }}>
                    <Flex align="center" justify="center" mb={{ base: 2, md: 3 }}>
                      <Text
                        color="black"
                        lineHeight="1.1"
                        fontSize={{ base: "lg", md: "xl" }}
                      >
                        {renderHighlightedWord(word.word)}
                      </Text>
                    </Flex>

                    <Button
                      bg="#00C0F3"
                      _hover={{
                        bg: "#00A8D9",
                        transform: { base: "scale(1.03)", md: "scale(1.04)" },
                      }}
                      color="white"
                      size={{ base: "md", md: "lg" }}
                      height={{ base: "42px", md: "48px" }}
                      onClick={() => playAudio(word.audio)}
                      leftIcon={<Icon as={FaVolumeUp} boxSize={{ base: 4, md: 5 }} />}
                      width="100%"
                      fontSize={{ base: "md", md: "lg" }}
                    >
                      <chakra.span srOnly>Reproducir audio</chakra.span>
                    </Button>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          <Box
            position="sticky"
            top={{ base: "calc(50vh - 24px)", md: "calc(50vh - 28px)" }}
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
                size={{ base: "md", md: "lg" }}
                borderRadius="full"
              />
            </Tooltip>
          </Box>
        </Flex>

        <Flex
          mt={{ base: 5, md: 6 }}
          gap={{ base: 3, md: 4 }}
          justify="center"
          display={{ base: "flex", md: "none" }}
        >
          <IconButton aria-label="Anterior" icon={<FaChevronLeft />} colorScheme="cyan" size="sm" onClick={goPrev} />
          <IconButton aria-label="Siguiente" icon={<FaChevronRight />} colorScheme="cyan" size="sm" onClick={goNext} />
        </Flex>
      </Box>
    </Box>
  );
}

export default Character;
