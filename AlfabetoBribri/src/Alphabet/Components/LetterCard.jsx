import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Box,
  Link,
  Image
} from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';

const LetterCard = ({ character, pronunciation, imageUrl }) => {
  return (
    <Link
      as={RouterLink}
      to={`/caracter/${encodeURIComponent(character)}`}
      _hover={{ textDecoration: "none" }}
    >
      <Card
        variant="outline"
        p={4}
        textAlign="center"
        minH="300px"
        transition="all 0.2s ease"
        _hover={{
          transform: "scale(1.05)",
          boxShadow: "lg",
          borderColor: "#00C0F3", // Color azul claro en hover
          cursor: "pointer"
        }}
        userSelect="none"
      >
        <CardHeader p={0} mb={3}>
          <Box
            bg="white"
            borderRadius="md"
            p={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            h="140px"
            w="100%"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Imagen de ${character}`}
                maxH="100%"
                maxW="100%"
                objectFit="contain"
                bg="white"
              />
            ) : (
              <Box
                as="span"
                fontSize="6rem"
                lineHeight="1"
                fontFamily="'Noto Sans', sans-serif"
                color="black" // Cambiado a negro
              >
                {character}
              </Box>
            )}
          </Box>
        </CardHeader>
        <CardBody>
          <Text fontSize="lg" color="gray.600">
            Pronunciación:
          </Text>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="black" // Cambiado a negro
            fontFamily="sans-serif"
          >
            {pronunciation}
          </Text>
        </CardBody>
      </Card>
    </Link>
  );
};

export default LetterCard;