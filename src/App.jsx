import { Routes, Route } from 'react-router-dom'
import './App.css'
import GenerateTitle from './components/GenerateTitle/GenerateTitle'
import GenerateCover from './components/GenerateCover/GenerateCover'
import StoryContextProvider from './contexts/StoryContext/StoryContextProvider'
import Chapters from './components/Chapters/Chapters'
import PrintBook from './components/PrintBook/PrintBook'

const App = () => {
  return (
    <StoryContextProvider>
      <Routes>
        <Route path='/' element={<GenerateTitle />}></Route>
        <Route path='/generate-cover' element={<GenerateCover />}></Route>
        <Route path='/chapters' element={<Chapters />}></Route>
        <Route path='/print-book' element={<PrintBook />}></Route>
      </Routes>
    </StoryContextProvider>
  )
}

export default App
