import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Box,
  Icon,
  Tooltip,
  Flex,
} from "@chakra-ui/react";
import { FiVolume2 } from "react-icons/fi";
import { useState } from "react";

const AFICard = ({ character, pronunciation, onPlayAudio }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      variant="outline"
      p={4}
      textAlign="center"
      minH="300px"
      position="relative"
      transition="all 0.2s ease"
      userSelect="none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      cursor="pointer"
      opacity={hovered ? 0.9 : 1}
      borderColor="gray.200"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "lg",
        borderColor: "#00C0F3",
      }}
    >
      {/* Icono grande en el centro al hacer hover */}
      {hovered && (
        <Flex
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          align="center"
          justify="center"
          bg="rgba(255,255,255,0.7)"
          zIndex={10}
        >
          <Tooltip label="Haz clic para oírlo" hasArrow>
            <Icon
              as={FiVolume2}
              boxSize={16} // Tamaño grande
              color="#00C0F3"
              cursor="pointer"
              onClick={onPlayAudio}
            />
          </Tooltip>
        </Flex>
      )}

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
          <Box
            as="span"
            fontSize="6rem"
            lineHeight="1"
            fontFamily="'Noto Sans', sans-serif"
            color="black"
          >
            {character}
          </Box>
        </Box>
      </CardHeader>
      <CardBody>
        <Text fontSize="lg" color="gray.600">
          Pronunciación:
        </Text>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="black"
          fontFamily="sans-serif"
        >
          {pronunciation}
        </Text>
      </CardBody>
    </Card>
  );
};

export default AFICard;
