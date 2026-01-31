import type { Cartoon } from '../App'

interface CartoonViewerProps {
  cartoon: Cartoon
}

const CartoonViewer = ({ cartoon }: CartoonViewerProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{cartoon.title}</h2>
        <p className="text-gray-600">{cartoon.summary}</p>
        <p className="text-sm text-gray-500 mt-2">
          생성 시간: {new Date(cartoon.createdAt).toLocaleString('ko-KR')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cartoon.scenes.map((scene) => (
          <div key={scene.sceneNumber} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-4">
              <h3 className="font-semibold text-lg mb-2">
                장면 {scene.sceneNumber}
              </h3>
              {scene.imageUrl ? (
                <img 
                  src={scene.imageUrl} 
                  alt={`Scene ${scene.sceneNumber}`}
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">이미지 생성 중...</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-700 mb-2">{scene.description}</p>
              {scene.dialogue && (
                <p className="text-sm font-medium text-indigo-600 italic">
                  "{scene.dialogue}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {cartoon.sources.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold text-lg mb-3">뉴스 출처</h4>
          <div className="grid gap-2">
            {cartoon.sources.slice(0, 3).map((source, index) => (
              <a 
                key={index}
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm truncate"
              >
                📰 {source}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CartoonViewer