import {
  Box,
  SimpleGrid,
  VStack,
  Image,
  Heading,
  Link,
  Flex,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

function GameHomePage() {
  const modes = [
    {
      key: "modo1",
      title: "I sa̠ú̠. ¿Ì dir beˈ a̠ ta̠?",
      subtitle: "Observe. ¿Qué cree que es?",
      imageUrl: "/modo-imagen.jpg",
    },
    {
      key: "modo2",
      title: "I kí̠tsö́. ¿I chè ieˈ rö beˈ a̠ ta̠?",
      subtitle: "Escuche. ¿Qué cree que dice?",
      imageUrl: "/modo-audio.jpg",
    },
    {
      key: "modo3",
      title: "I sa̠ú̠. ¿Ì dir beˈ a̠ ta̠?",
      subtitle: "Observe. ¿Qué cree que es?",
      title2: "I kí̠tsö́. ¿I chè ieˈ rö beˈ a̠ ta̠?",
      subtitle2: "Escuche. ¿Qué cree que dice?",
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
            {modes.map(({ key, title, subtitle, title2, subtitle2, imageUrl }) => (
              <Box
                key={key}
                transform="translateY(0)"
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{
                  transform: "translateY(-8px)",
                  filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))",
                }}
                h="full"
              >
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  borderColor="gray.200"
                  boxShadow="md"
                  userSelect="none"
                  bg="white"
                  h="full"
                  display="flex"
                  flexDirection="column"
                >
                  {/* Nombre y subtítulo */}
                  <Link
                    as={RouterLink}
                    to={`/juego/${key}`}
                    _hover={{ textDecoration: "none", bg: "#0099CC" }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    px={4}
                    py={3}
                    bg="#00C0F3"
                    borderBottom="1px solid rgba(0,0,0,0.05)"
                    h={{ base: "140px", md: "160px" }}
                    gap={2}
                  >
                    <VStack spacing={1}>
                      <Heading 
                        size="md" 
                        color="white" 
                        textAlign="center"
                        fontSize={{ base: "md", md: "lg" }}
                      >
                        {title}
                      </Heading>
                      <Text
                        color="whiteAlpha.800"
                        textAlign="center"
                        fontWeight="medium"
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        {subtitle}
                      </Text>
                    </VStack>

                    {title2 && (
                      <VStack spacing={1} mt={2}>
                        <Heading 
                          size="md" 
                          color="white" 
                          textAlign="center"
                          fontSize={{ base: "md", md: "lg" }}
                        >
                          {title2}
                        </Heading>
                        <Text
                          color="whiteAlpha.800"
                          textAlign="center"
                          fontWeight="medium"
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          {subtitle2}
                        </Text>
                      </VStack>
                    )}
                  </Link>

                  {/* Imagen */}
                  <Link
                    as={RouterLink}
                    to={`/juego/${key}`}
                    _hover={{ opacity: 0.9 }}
                    display="block"
                    flex="1"
                  >
                    <Image
                      src={imageUrl}
                      alt={title}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      minH="280px"
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