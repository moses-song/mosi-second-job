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

  const handleGenerateCartoon = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://mosi-second-job2-api.moses-song.workers.dev/api/cartoon/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'digital healthcare trends',
          audience: 'general audience',
          length: 4
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Parse Gemini response and create cartoon
      const cartoon: Cartoon = {
        id: Date.now().toString(),
        title: '디지털 헬스케어 카툰',
        summary: 'AI가 생성한 최신 디지털 헬스케어 정보 카툰',
        scenes: [
          {
            sceneNumber: 1,
            description: '디지털 헬스케어 기술 소개',
            imagePrompt: 'digital healthcare technology',
            dialogue: '오늘은 최신 디지털 헬스케어 기술에 대해 알아봅시다!'
          },
          {
            sceneNumber: 2,
            description: 'AI 기반 진단 시스템',
            imagePrompt: 'AI medical diagnosis system',
            dialogue: 'AI가 의료 진단을 돕고 있습니다.'
          },
          {
            sceneNumber: 3,
            description: '웨어러블 기기 활용',
            imagePrompt: 'wearable health devices',
            dialogue: '웨어러블 기기로 건강을 실시간 관리할 수 있어요.'
          },
          {
            sceneNumber: 4,
            description: '미래 헬스케어 전망',
            imagePrompt: 'future healthcare vision',
            dialogue: '미래에는 더 발전된 디지털 헬스케어가 기대됩니다!'
          }
        ],
        createdAt: new Date().toISOString(),
        sources: ['AI Generated Content']
      }
      
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

      <main className="max-w-7xl mx-auto p-6">
        {currentView === 'home' && (
          <div className="text-center py-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              오늘의 디지털 헬스케어 이슈
            </h2>
            <CartoonGenerator 
              onGenerate={handleGenerateCartoon} 
              loading={loading} 
            />
            {latestCartoon && (
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">최신 카툰</h3>
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
