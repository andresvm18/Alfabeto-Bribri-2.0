# 🎮 Web Educativa - Vocabulario Bribrí

Aplicación web interactiva desarrollada con **React** y **Chakra UI**, diseñada para aprender y reforzar vocabulario de la **Lengua Indigena Bribrí**.  
Incluye distintos modos de juego con preguntas aleatorias basadas en **imágenes** y **audios**, conectándose a una base de datos en **Supabase**.

---

## ✨ Funcionalidades

- **Exploración del alfabeto:**
  - Visualiza **vocales, consonantes y tonos** con **3 ejemplos** por letra (imagen y audio).
- **Juego interactivo:**
  - **3 Modos de juego:**
    - 🖼️ **Modo 1**: Preguntas basadas en imágenes.
    - 🔊 **Modo 2**: Preguntas basadas en audios.
    - 🎲 **Modo 3**: Preguntas mixtas (imagen o audio al azar).
  - **Preguntas dinámicas:** Se generan 10 preguntas aleatorias en cada partida.
  - **Opciones múltiples:** 1 respuesta correcta + 3 incorrectas.
  - **Retroalimentación inmediata** y animación **confeti** al acertar.
  - **Progreso y puntaje** visibles en todo momento.
  - **Pantalla final** con resumen, motivación y opción de volver a jugar.
- **Historia de la lengua:**
  - Breve reseña sobre la **historia y contexto cultural** de la lengua Bribrí.

---

## 🛠 Tecnologías utilizadas

- [React](https://reactjs.org/) con Hooks y React Router.
- [Chakra UI](https://chakra-ui.com/) para la interfaz y estilos.
- [Supabase](https://supabase.com/) como backend y base de datos.
- [React Icons](https://react-icons.github.io/react-icons/) para iconografía.
- [react-confetti](https://www.npmjs.com/package/react-confetti) para animaciones.

---

## 📂 Estructura del proyecto
```bash
src/
├─ Alphabet/
│ ├─ Components/
│ │ └─ LetterCard.jsx
│ ├─ Screens/
│ │ ├─ Alphabet.jsx
│ │ └─ Character.jsx
├─ Game/
│ ├─ Components/
│ │ ├─ OptionList.jsx
│ │ └─ QuestionDisplay.jsx
│ ├─ Screens/
│ │ ├─ Game.jsx
│ │ └─ GameHome.jsx
├─ Shared/
│ ├─ Components/
│ │ ├─ Header.jsx
│ │ └─ Footer.jsx
│ ├─ Screens/
│ │ ├─ Hisotry.jsx
│ │ └─ Home.jsx
├─ App.jsx
├─ main.jsx
├─ supabaseClient.js
└─ theme.js
```
---

## 📋 Requisitos previos

- **Node.js** >= 14.x
- **npm** o **yarn**
- Cuenta en **Supabase** con tabla `Ejemplos` que tenga las columnas:
  - `word` (texto)
  - `audio` (URL o referencia a archivo de audio)
  - `image` (URL o referencia a archivo de imagen)

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/lenguasytradiciones/Alfabeto-bribri-2.0-web-.git
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar la aplicación
```bash
npm run dev
```
