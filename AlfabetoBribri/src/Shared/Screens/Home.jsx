import { Box, SimpleGrid, VStack, Image, Heading, Text, Button } from '@chakra-ui/react';
import Alphabet from "../../Assets/Alfabeto.jpg";
import Game from "../../Assets/Juego.jpeg";

function HomePage() {
  const buttonStyles = {
    bg: "#00C0F3",
    color: "white",
    _hover: {
      bg: "#0099CC",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(0, 192, 243, 0.3)"
    },
    _active: {
      transform: "translateY(0)"
    },
    borderRadius: "md",
    fontWeight: "semibold",
    fontSize: "md",
    width: "full",
    py: 4,
  };

  return (
    <Box
      minH="100vh"
      bg="white"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-50px"
        left="-50px"
        width="200px"
        height="200px"
        borderRadius="50%"
        bg="rgba(0, 0, 0, 0.05)"
        filter="blur(3px)"
      />
      <Box
        position="absolute"
        bottom="-100px"
        right="-100px"
        width="300px"
        height="300px"
        borderRadius="50%"
        bg="rgba(0, 0, 0, 0.03)"
        filter="blur(4px)"
      />

      <Box
        position="relative"
        zIndex={1}
        textAlign="center"
        py={20}
        px={6}
      >
        <VStack spacing={16}>
          <VStack spacing={6} mb={8}>
            <Heading
              as="h1"
              size="2xl"
              color="gray.800"
              fontWeight="bold"
              textShadow="2px 2px 4px rgba(0,0,0,0.1)"
              letterSpacing="tight"
            >
              Aprende y Descubre
            </Heading>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={12}
            maxW="1200px"
            mx="auto"
            w="full"
          >
            <Box
              transform="translateY(0)"
              transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                transform: "translateY(-8px)",
                filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))"
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
                <Image
                  // ToDo: cambiar la imagen cuando Laura la tenga lista
                  src={Alphabet}
                  alt="Alfabeto"
                  width="100%"
                  height="280px"
                  objectFit="cover"
                  borderRadius="lg lg 0 0"
                />

                <Box p={6}>
                  <Heading size="md" mb={2}>Alfabeto</Heading>
                  <Text mb={4}>
                    Explora el alfabeto completo con ilustraciones interactivas y pronunciación guiada para un aprendizaje efectivo.
                  </Text>

                  <Button as="a" href="/alfabeto" {...buttonStyles}>
                    Ver Alfabeto
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box
              transform="translateY(0)"
              transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                transform: "translateY(-8px)",
                filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))"
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
                <Image
                  // ToDo: cambiar la imagen cuando Laura la tenga lista
                  src={Game}
                  alt="Aprende Jugando"
                  width="100%"
                  height="280px"
                  objectFit="cover"
                  borderRadius="lg lg 0 0"
                />

                <Box p={6}>
                  <Heading size="md" mb={2}>Aprende Jugando</Heading>
                  <Text mb={4}>
                    Sumérgete en juegos educativos diseñados para hacer del aprendizaje una experiencia divertida y memorable.
                  </Text>

                  <Button as="a" href="/aprende" {...buttonStyles}>
                    Empezar a Jugar
                  </Button>
                </Box>
              </Box>
            </Box>
          </SimpleGrid>

          <Box
            position="absolute"
            top="20%"
            right="10%"
            width="60px"
            height="60px"
            borderRadius="50%"
            bg="rgba(0, 192, 243, 0.1)"
            animation="float 6s ease-in-out infinite"
            display={{ base: "none", lg: "block" }}
          />
          <Box
            position="absolute"
            top="60%"
            left="8%"
            width="40px"
            height="40px"
            borderRadius="50%"
            bg="rgba(0, 0, 0, 0.05)"
            animation="float 8s ease-in-out infinite reverse"
            display={{ base: "none", lg: "block" }}
          />
        </VStack>
      </Box>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </Box>
  );
}

export default HomePage;