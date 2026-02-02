interface CartoonGeneratorProps {
  onGenerate: (query: string) => void
  loading: boolean
}

const CartoonGenerator = ({ onGenerate, loading }: CartoonGeneratorProps) => {
  const [query, setQuery] = useState('')

  const handleSubmit = () => {
    onGenerate(query)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            오늘의 카툰 생성하기
          </h3>
          <p className="text-gray-600">
            최신 디지털 헬스케어 뉴스를 분석하여 4-6장의 카툰을 생성합니다
          </p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 디지털 헬스케어 트렌드, AI 의료 혁신"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !query.trim()}
          className={`px-8 py-4 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
            loading || !query.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              카툰 생성 중... (약 1-2분 소요)
            </span>
          ) : (
            '🚀 카툰 생성하기'
          )}
        </button>

        <div className="mt-6 text-sm text-gray-500">
          <p>⚡ AI가 뉴스를 분석하고 자동으로 이미지를 생성합니다</p>
          <p>📱 DALL-E 3와 GPT-4를 사용하여 고품질 카툰을 만듭니다</p>
        </div>
      </div>
    </div>
  )
}

export default CartoonGenerator