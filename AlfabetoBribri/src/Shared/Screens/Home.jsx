import React from 'react';
import {
  Box,
  SimpleGrid,
  VStack,
  Image,
  Heading,
  Link,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import Alphabet from '../../Assets/Alfabeto.jpg';
import Game from '../../Assets/Juego.jpeg';

function HomePage() {
  return (
    <Box
      minH="100vh"
      bg="white"
      position="relative"
      overflow="hidden"
      userSelect="none"
    >
      {/* blobs decorativos */}
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

      {/* Contenedor centrado */}
      <Flex
        position="relative"
        zIndex={1}
        justify="center"
        align="center"
        minH="100vh"
        px={6}
      >
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={12}
          maxW="1200px"
          w="full"
        >
          {/* Card: Alfabeto */}
          <Box
            transform="translateY(0)"
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              transform: 'translateY(-8px)',
              filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))',
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
              {/* Nombre clickeable */}
              <Link
                as={RouterLink}
                to="/alfabeto"
                _hover={{ textDecoration: 'none', bg: '#0099CC' }}
                display="block"
                px={4}
                py={3}
                bg="#00C0F3"
                borderBottom="1px solid rgba(0,0,0,0.05)"
              >
                <Heading size="md" color="white" textAlign="center" mb={1}>
                  Beˈ e̠ˈ yawö́ ké̠we
                </Heading>
                <Heading
                  size="sm"
                  color="whiteAlpha.800"
                  textAlign="center"
                  fontWeight="medium"
                >
                  Estudie primero
                </Heading>
              </Link>

              {/* Imagen clickeable */}
              <Link
                as={RouterLink}
                to="/alfabeto"
                _hover={{ opacity: 0.9 }}
                display="block"
              >
                <Image
                  src={Alphabet}
                  alt="Alfabeto"
                  width="100%"
                  height="280px"
                  objectFit="cover"
                  borderRadius="0 0 lg lg"
                />
              </Link>
            </Box>
          </Box>

          {/* Card: Aprende Jugando */}
          <Box
            transform="translateY(0)"
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              transform: 'translateY(-8px)',
              filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))',
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
              {/* Nombre clickeable */}
              <Link
                as={RouterLink}
                to="/aprende"
                _hover={{ textDecoration: 'none', bg: '#0099CC' }}
                display="block"
                px={4}
                py={3}
                bg="#00C0F3"
                borderBottom="1px solid rgba(0,0,0,0.05)"
              >
                <Heading size="md" color="white" textAlign="center" mb={1}>
                  I ma̠ú̠ í̠e̠
                </Heading>
                <Heading
                  size="sm"
                  color="whiteAlpha.800"
                  textAlign="center"
                  fontWeight="medium"
                >
                  Practique aquí
                </Heading>
              </Link>

              {/* Imagen clickeable */}
              <Link
                as={RouterLink}
                to="/aprende"
                _hover={{ opacity: 0.9 }}
                display="block"
              >
                <Image
                  src={Game}
                  alt="Aprende Jugando"
                  width="100%"
                  height="280px"
                  objectFit="cover"
                  borderRadius="0 0 lg lg"
                />
              </Link>
            </Box>
          </Box>
        </SimpleGrid>
      </Flex>

      {/* Animaciones decorativas */}
      <Box
        position="absolute"
        top="20%"
        right="10%"
        width="60px"
        height="60px"
        borderRadius="50%"
        bg="rgba(0, 192, 243, 0.1)"
        animation="float 6s ease-in-out infinite"
        display={{ base: 'none', lg: 'block' }}
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
        display={{ base: 'none', lg: 'block' }}
      />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
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
