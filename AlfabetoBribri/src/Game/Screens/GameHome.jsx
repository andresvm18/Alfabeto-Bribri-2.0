import { Box, VStack, Heading, Text, Image, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function GameHomePage() {
  const navigate = useNavigate();

  const modes = [
    {
      key: "modo1",
      title: "¿Cómo se llama? (Imagen)",
      description: "Identifica la palabra bribrí que corresponde a la imagen mostrada.",
      imageUrl: "/modo-imagen.jpg",
    },
    {
      key: "modo2",
      title: "¿Cómo se escribe? (Audio)",
      description: "Escucha el audio y selecciona la palabra escrita correctamente.",
      imageUrl: "/modo-audio.jpg",
    },
    {
      key: "modo3",
      title: "Examen mixto",
      description:
        "Mezcla aleatoria de imágenes y audios para probar todo tu conocimiento.",
      imageUrl: "/modo-mixto.jpg",
    },
    {
      key: "modo4",
      title: "Sopa de letras",
      description: "Encuentra las palabras bribrí ocultas en una sopa de letras.",
      imageUrl: "/modo-sopa-letras.jpg",
    },
  ];

  const mainColor = "#00C0F3";
  const mainHoverColor = "#0099CC";
  const mainShadow = "0 8px 25px rgba(0, 192, 243, 0.5)";

  return (
    <Box minH="100vh" bg="white" py={20} px={6} textAlign="center">
      <VStack spacing={16} maxW="1500px" mx="auto">
        <Heading
          as="h1"
          size="2xl"
          color="gray.800"
          fontWeight="bold"
          textShadow="2px 2px 4px rgba(0,0,0,0.1)"
          letterSpacing="tight"
        >
          Elige tu modo de juego
        </Heading>

        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }}
          gap={10}
        >

          {modes.map(({ key, title, description, imageUrl }) => (
            <Box
              key={key}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              borderColor={mainColor}
              boxShadow="md"
              userSelect="none"
              transition="transform 0.3s ease, box-shadow 0.3s ease"
              cursor="pointer"
              _hover={{
                transform: "translateY(-8px)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
              }}
              onClick={() => navigate(`/juego/${key}`)}
            >
              <Image
                src={imageUrl}
                alt={title}
                width="100%"
                height="280px"
                objectFit="cover"
                borderRadius="16px 16px 0 0"
                draggable={false}
                userSelect="none"
              />
              <Box p={6}>
                <Heading size="md" mb={2}>
                  {title}
                </Heading>
                <Text mb={4}>{description}</Text>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/juego/${key}`);
                  }}
                  bg={mainColor}
                  color="white"
                  _hover={{
                    bg: mainHoverColor,
                    transform: "translateY(-2px)",
                    boxShadow: mainShadow,
                  }}
                  _active={{ transform: "translateY(0)" }}
                  borderRadius="md"
                  fontWeight="semibold"
                  fontSize="md"
                  width="full"
                  py={4}
                >
                  Jugar
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </VStack>
    </Box>
  );
}

export default GameHomePage;