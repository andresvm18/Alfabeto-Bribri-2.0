import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Image,
  Text,
  Button,
  Flex,
  SimpleGrid,
  Icon,
  Spinner,
  chakra
} from "@chakra-ui/react";
import { FaVolumeUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import errorAnimation from "../../Assets/Error.json";
import { supabase } from "../../supabaseClient";

function Character() {
  const { letra } = useParams();
  const decodedLetter = decodeURIComponent(letra);
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});

  const normalizeChar = (char) =>
    char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const renderHighlightedWord = (word) => {
    const prefix = "seˈ";
    const normalizedPrefix = normalizeChar(prefix);

    if (normalizeChar(word).startsWith(normalizedPrefix)) {
      return (
        <>
          <chakra.span
            fontWeight="normal"
            fontSize="xl"
            color="gray.400"
          >
            {word.slice(0, 3)}
          </chakra.span>
          {word.slice(3).split("").map((char, i) => (
            <chakra.span
              key={i}
              fontWeight={
                normalizeChar(char) === normalizeChar(decodedLetter)
                  ? "bold"
                  : "normal"
              }
              fontSize="xl"
              color="black"
            >
              {char}
            </chakra.span>
          ))}
        </>
      );
    }

    return word.split("").map((char, i) => (
      <chakra.span
        key={i}
        fontWeight={
          normalizeChar(char) === normalizeChar(decodedLetter)
            ? "bold"
            : "normal"
        }
        fontSize="xl"
        color="black"
      >
        {char}
      </chakra.span>
    ));
  };

  const playAudio = (audioUrl) => {
    new Audio(audioUrl).play();
  };

  useEffect(() => {
    const fetchExamples = async () => {
      setLoading(true);
      setError(null);

      const { data: letters, error: letterError } = await supabase
        .from("Alfabeto")
        .select("id")
        .eq("letter", decodedLetter)
        .single();

      if (letterError || !letters) {
        setError(`No se encontró la letra: ${decodedLetter}`);
        setLoading(false);
        return;
      }

      const { data: examplesData, error: examplesError } = await supabase
        .from("Ejemplos")
        .select("id, word, audio, image, interpretation")
        .eq("letter_id", letters.id);

      if (examplesError) {
        setError("Error al obtener ejemplos.");
      } else {
        if (!examplesData || examplesData.length === 0) {
          setError(`No hay ejemplos para la letra: ${decodedLetter}`);
          setLoading(false);
          return;
        }
        setExamples(examplesData);
      }

      setLoading(false);
    };

    fetchExamples();
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
          <Lottie animationData={errorAnimation} loop={true} />
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
    >
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
