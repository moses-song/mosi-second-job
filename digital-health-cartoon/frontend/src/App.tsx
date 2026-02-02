import { useState } from 'react'
import './App.css'
import CartoonViewer from './components/CartoonViewer'
import NewsSummary from './components/NewsSummary'
import CartoonGenerator from './components/CartoonGenerator'

export interface CartoonScene {
  sceneNumber: number;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
  dialogue?: string;
}

export interface Cartoon {
  id: string;
  title: string;
  summary: string;
  scenes: CartoonScene[];
  createdAt: string;
  sources: string[];
}

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'cartoon' | 'news'>('home')
  const [latestCartoon, setLatestCartoon] = useState<Cartoon | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerateCartoon = async (query: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/cartoon/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }), // Send the query in the request body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const cartoon: Cartoon = await response.json();
      
      setLatestCartoon(cartoon)
      setCurrentView('cartoon')
    } catch (error) {
      console.error('Failed to generate cartoon:', error)
      alert('카툰 생성에 실패했습니다. 나중에 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-indigo-900">
            🏥 디지털 헬스케어 카툰
          </h1>
          <p className="text-gray-600 mt-2">
            매일 최신 디지털 헬스케어 뉴스를 카툰으로 만나보세요
          </p>
        </div>
      </header>

      <nav className="bg-indigo-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex space-x-6">
          <button 
            onClick={() => setCurrentView('home')}
            className={`px-4 py-2 rounded ${currentView === 'home' ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`}
          >
            홈
          </button>
          <button 
            onClick={() => setCurrentView('cartoon')}
            className={`px-4 py-2 rounded ${currentView === 'cartoon' ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`}
          >
            카툰 보기
          </button>
          <button 
            onClick={() => setCurrentView('news')}
            className={`px-4 py-2 rounded ${currentView === 'news' ? 'bg-indigo-800' : 'hover:bg-indigo-700'}`}
          >
            뉴스 요약
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        {currentView === 'home' && (
          <div className="py-8 lg:py-12">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8 lg:mb-12">
              새로운 카툰 생성하기
            </h2>
            <CartoonGenerator 
              onGenerate={handleGenerateCartoon} 
              loading={loading} 
            />
            {latestCartoon && (
              <div className="mt-12 p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-3xl font-bold text-indigo-900 mb-6 border-b pb-4">최신 생성 카툰</h3>
                <CartoonViewer cartoon={latestCartoon} />
              </div>
            )}
          </div>
        )}

        {currentView === 'cartoon' && latestCartoon && (
          <CartoonViewer cartoon={latestCartoon} />
        )}

        {currentView === 'news' && <NewsSummary />}
      </main>
    </div>
  )
}

export default App
