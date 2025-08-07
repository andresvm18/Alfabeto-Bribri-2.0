import { 
  Box, 
  Image, 
  Button, 
  Icon, 
  Text, 
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription
} from "@chakra-ui/react";
import { FaVolumeUp, FaPlay, FaPause } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";

function QuestionDisplay({ type, source, instructions }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (type === "audio" && audioRef.current) {
      const audio = audioRef.current;
      
      const handleLoadedData = () => setAudioLoaded(true);
      const handleError = () => setAudioError(true);
      const handleEnded = () => setIsPlaying(false);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener('loadeddata', handleLoadedData);
      audio.addEventListener('error', handleError);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      return () => {
        audio.removeEventListener('loadeddata', handleLoadedData);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [type, source]);

  // 🚀 Aquí reiniciamos estado cuando cambia source o type
  useEffect(() => {
    if (type === "image") {
      setImageLoaded(false);
      setImageError(false);
    } else if (type === "audio") {
      setAudioLoaded(false);
      setAudioError(false);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [type, source]);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  return (
    <Box w="full" userSelect="none" position="relative">
      <VStack spacing={6}>
        <Box
          w="full"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minH="300px"
          bg="gradient-to-br from-gray-50 to-gray-100"
          borderRadius="2xl"
          boxShadow="inner"
          p={8}
          border="1px solid"
          borderColor="gray.200"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            borderRadius: "2xl"
          }}
        >
          {type === "image" ? (
            <Box position="relative" textAlign="center">
              {!imageLoaded && !imageError && (
                <Box 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  minH="220px"
                  flexDirection="column"
                  gap={4}
                >
                  <Spinner size="xl" color="#00C0F3" thickness="4px" />
                  <Text color="gray.500" fontSize="md">
                    Cargando imagen...
                  </Text>
                </Box>
              )}

              {imageError && (
                <Alert status="error" borderRadius="xl" maxW="400px">
                  <AlertIcon />
                  <AlertDescription>
                    Error al cargar la imagen. Por favor, verifica la URL.
                  </AlertDescription>
                </Alert>
              )}

              {!imageError && (
                <Image
                  src={source}
                  alt="Pregunta visual"
                  maxH="280px"
                  maxW="100%"
                  objectFit="contain"
                  borderRadius="xl"
                  boxShadow="xl"
                  draggable={false}
                  userSelect="none"
                  transition="all 0.3s ease"
                  _hover={{ 
                    transform: "scale(1.02)",
                    boxShadow: "2xl"
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  display={imageLoaded ? "block" : "none"}
                />
              )}
            </Box>
          ) : (
            <Box textAlign="center">
              <audio ref={audioRef} src={source} preload="auto" />

              <Box 
                mb={8}
                p={8}
                bg="white"
                borderRadius="full"
                boxShadow="xl"
                border="3px solid"
                borderColor="#00C0F3"
                w="120px"
                h="120px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                position="relative"
                overflow="hidden"
                _before={isPlaying ? {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(45deg, rgba(0, 192, 243, 0.1) 0%, rgba(0, 153, 204, 0.1) 100%)",
                  animation: "pulse 1.5s ease-in-out infinite"
                } : {}}
              >
                <Icon 
                  as={FaVolumeUp} 
                  boxSize={12} 
                  color="#00C0F3"
                  animation={isPlaying ? "bounce 1s ease-in-out infinite" : "none"}
                />
              </Box>

              {audioError ? (
                <Alert status="error" borderRadius="xl" maxW="400px" mx="auto">
                  <AlertIcon />
                  <AlertDescription>
                    Error al cargar el audio. Verifica la URL.
                  </AlertDescription>
                </Alert>
              ) : (
                <Button
                  onClick={handlePlayAudio}
                  bg={isPlaying ? "#0099CC" : "#00C0F3"}
                  color="white"
                  size="lg"
                  px={8}
                  py={6}
                  borderRadius="full"
                  fontSize="lg"
                  fontWeight="bold"
                  leftIcon={
                    !audioLoaded ? (
                      <Spinner size="sm" />
                    ) : (
                      <Icon as={isPlaying ? FaPause : FaPlay} />
                    )
                  }
                  _hover={{ 
                    bg: "#0099CC",
                    transform: "translateY(-2px)",
                    boxShadow: "xl"
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s ease"
                  disabled={!audioLoaded}
                  boxShadow="lg"
                >
                  {!audioLoaded 
                    ? "Cargando..." 
                    : isPlaying 
                      ? "Pausar audio" 
                      : "Reproducir audio"}
                </Button>
              )}
            </Box>
          )}
        </Box>

        {instructions && (
          <Box
            bg="white"
            borderRadius="xl"
            p={6}
            boxShadow="md"
            border="1px solid"
            borderColor="gray.200"
            maxW="600px"
            mx="auto"
            position="relative"
          >
            <Text 
              fontSize="lg" 
              color="gray.700" 
              textAlign="center"
              fontWeight="medium"
              lineHeight="tall"
            >
              {instructions}
            </Text>
            <Box
              position="absolute"
              top={0}
              left="50%"
              transform="translateX(-50%) translateY(-50%)"
              w="40px"
              h="4px"
              bg="#00C0F3"
              borderRadius="full"
            />
          </Box>
        )}
      </VStack>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </Box>
  );
}

export default QuestionDisplay;
