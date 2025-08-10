import { SimpleGrid, Button, Box, Icon, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

function OptionsList({ options, correctAnswer, onAnswer, disabled }) {
  const [selected, setSelected] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setSelected(null);
    setIsAnimating(false);
  }, [options]);

  const handleClick = async (option) => {
    if (disabled || selected !== null || isAnimating) return;

    setIsAnimating(true);
    setSelected(option);

    setTimeout(() => {
      const isCorrect = option === correctAnswer;
      onAnswer(isCorrect);
      setIsAnimating(false);
    }, 300);
  };

  const baseStyles = {
    w: "full",
    minH: { base: "60px", md: "70px" }, // Altura mínima responsiva
    py: { base: 4, md: 6 },
    px: { base: 4, md: 8 },
    borderRadius: "xl",
    fontWeight: "semibold",
    fontSize: { base: "sm", sm: "md", md: "lg" },
    transition: "all 0.2s ease",
    border: "2px solid",
    position: "relative",
    overflow: "hidden",
    _before: {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
      transition: "left 0.5s ease",
    },
  };

  const getButtonStyles = (option) => {
    if (selected === null) {
      return {
        ...baseStyles,
        bg: "white",
        borderColor: "#00C0F3",
        color: "#00C0F3",
        _hover: {
          bg: "#00C0F3",
          color: "white",
          borderColor: "#00C0F3",
          transform: "translateY(-2px)",
          boxShadow: "lg",
          _before: { left: "100%" },
        },
        _active: {
          transform: "translateY(0)",
          _before: { left: "100%" },
        },
      };
    }

    if (option === correctAnswer) {
      return {
        ...baseStyles,
        bg: "green.400",
        borderColor: "green.500",
        color: "white",
        boxShadow: "0 0 20px rgba(72, 187, 120, 0.4)",
        animation: selected === option ? "pulse 0.5s ease-in-out" : "none",
      };
    }

    if (option === selected && option !== correctAnswer) {
      return {
        ...baseStyles,
        bg: "red.400",
        borderColor: "red.500",
        color: "white",
        boxShadow: "0 0 20px rgba(245, 101, 101, 0.4)",
        animation: "shake 0.5s ease-in-out",
      };
    }

    return {
      ...baseStyles,
      bg: "gray.100",
      borderColor: "gray.200",
      color: "gray.500",
      opacity: 0.6,
    };
  };

  const getIcon = (option) => {
    if (selected === null) return null;
    if (option === correctAnswer) return FaCheck;
    if (option === selected && option !== correctAnswer) return FaTimes;
    return null;
  };

  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D...
  };

  return (
    <Box w="full">
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {selected !== null && (
        <Box
          mb={6}
          p={4}
          borderRadius="xl"
          bg={selected === correctAnswer ? "green.50" : "red.50"}
          border="1px solid"
          borderColor={selected === correctAnswer ? "green.200" : "red.200"}
          textAlign="center"
          animation="fadeIn 0.3s ease-in-out"
          userSelect={"none"}
        >
          <Text
            color={selected === correctAnswer ? "green.600" : "red.600"}
            fontWeight="bold"
            fontSize="lg"
          >
            {selected === correctAnswer
              ? "¡Excelente! Respuesta correcta 🎉"
              : `Incorrecto. La respuesta correcta es: ${correctAnswer} 📚`}
          </Text>
        </Box>
      )}

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
        {options.map((option, idx) => {
          const IconComponent = getIcon(option);
          const buttonStyles = getButtonStyles(option);

          return (
            <Button
              key={idx}
              {...buttonStyles}
              onClick={() => handleClick(option)}
              disabled={disabled || selected !== null || isAnimating}
              leftIcon={
                <Box
                  minW="32px"
                  h="32px"
                  borderRadius="full"
                  bg={
                    selected === null
                      ? "#00C0F3"
                      : option === correctAnswer
                        ? "green.600"
                        : option === selected
                          ? "red.600"
                          : "gray.400"
                  }
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="sm"
                  fontWeight="bold"
                  transition="all 0.2s ease"
                >
                  {IconComponent ? (
                    <Icon as={IconComponent} boxSize={4} />
                  ) : (
                    getOptionLetter(idx)
                  )}
                </Box>
              }
              rightIcon={
                selected !== null && option === correctAnswer ? (
                  <Box
                    w="24px"
                    h="24px"
                    borderRadius="full"
                    bg="green.600"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaCheck} boxSize={3} color="white" />
                  </Box>
                ) : selected === option && option !== correctAnswer ? (
                  <Box
                    w="24px"
                    h="24px"
                    borderRadius="full"
                    bg="red.600"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaTimes} boxSize={3} color="white" />
                  </Box>
                ) : null
              }
            >
              <Text
                flex={1}
                textAlign="left"
                pl={2}
                whiteSpace="normal"
                wordBreak="break-word"
                fontSize={{ base: "sm", sm: "md", md: "lg" }}
              >
                {option}
              </Text>
            </Button>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

export default OptionsList;
