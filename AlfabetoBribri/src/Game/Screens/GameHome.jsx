import {
  Box,
  SimpleGrid,
  VStack,
  Image,
  Heading,
  Link,
  Flex,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

function GameHomePage() {
  const modes = [
    {
      key: "modo1",
      title: "¿Cómo se llama? (Imagen)",
      subtitle: "Identifica la palabra bribrí que corresponde a la imagen mostrada.",
      imageUrl: "/modo-imagen.jpg",
    },
    {
      key: "modo2",
      title: "¿Cómo se escribe? (Audio)",
      subtitle: "Escucha el audio y selecciona la palabra escrita correctamente.",
      imageUrl: "/modo-audio.jpg",
    },
    {
      key: "modo3",
      title: "Examen mixto",
      subtitle: "Mezcla aleatoria de imágenes y audios para probar todo tu conocimiento.",
      imageUrl: "/modo-mixto.jpg",
    },
  ];

  return (
    <Flex
      minH="100vh"
      bg="white"
      align="center"
      justify="center"
      px={6}
      py={12}
    >
      <Box w="full" maxW="1200px">
        <VStack spacing={16}>
          <SimpleGrid
            columns={{ base: 1, md: 2, xl: 3 }}
            spacing={12}
            w="full"
          >
            {modes.map(({ key, title, subtitle, imageUrl }) => (
              <Box
                key={key}
                transform="translateY(0)"
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{
                  transform: "translateY(-8px)",
                  filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))",
                }}
              >
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  borderColor="gray.200"
                  boxShadow="md"
                  userSelect="none"
                  bg="white"
                >
                  {/* Nombre y subtítulo */}
                  <Link
                    as={RouterLink}
                    to={`/juego/${key}`}
                    _hover={{ textDecoration: "none", bg: "#0099CC" }}
                    display="block"
                    px={4}
                    py={3}
                    bg="#00C0F3"
                    borderBottom="1px solid rgba(0,0,0,0.05)"
                  >
                    <Heading size="md" color="white" textAlign="center" mb={1}>
                      {title}
                    </Heading>
                    <Heading
                      size="sm"
                      color="whiteAlpha.800"
                      textAlign="center"
                      fontWeight="medium"
                    >
                      {subtitle}
                    </Heading>
                  </Link>

                  {/* Imagen */}
                  <Link
                    as={RouterLink}
                    to={`/juego/${key}`}
                    _hover={{ opacity: 0.9 }}
                    display="block"
                  >
                    <Image
                      src={imageUrl}
                      alt={title}
                      width="100%"
                      height="280px"
                      objectFit="cover"
                      borderRadius="0 0 lg lg"
                    />
                  </Link>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    </Flex>
  );
}

export default GameHomePage;
