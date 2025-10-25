import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Box,
  Image
} from "@chakra-ui/react";

const LetterCard = ({ character, pronunciation }) => {
  return (
    <Card
      variant="outline"
      p={4}
      textAlign="center"
      minH="300px"
      transition="all 0.2s ease"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "lg",
        borderColor: "#00C0F3",
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
          Símbolo AFI
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

export default LetterCard;
