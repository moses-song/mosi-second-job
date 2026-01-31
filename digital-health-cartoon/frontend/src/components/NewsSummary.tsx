import { useState, useEffect } from 'react'

interface NewsSummaryData {
  summary: string
  newsCount: number
  date: string
}

const NewsSummary = () => {
  const [summaryData, setSummaryData] = useState<NewsSummaryData | null>(null)
  const [latestNews, setLatestNews] = useState<any[]>([])
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, newsRes, youtubeRes] = await Promise.all([
          fetch('http://localhost:3001/api/cartoons/summary'),
          fetch('http://localhost:3001/api/news/latest'),
          fetch('http://localhost:3001/api/news/youtube')
        ])

        const summary = await summaryRes.json()
        const news = await newsRes.json()
        const youtube = await youtubeRes.json()

        setSummaryData(summary)
        setLatestNews(news.slice(0, 5))
        setYoutubeVideos(youtube.slice(0, 3))
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">데이터 로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {summaryData && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📊 오늘의 헬스케어 뉴스 요약
          </h2>
          <p className="text-lg text-gray-700 mb-4">{summaryData.summary}</p>
          <div className="flex space-x-6 text-sm text-gray-600">
            <span>📰 총 {summaryData.newsCount}개의 뉴스</span>
            <span>📅 {new Date(summaryData.date).toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📰 최신 뉴스</h3>
          <div className="space-y-4">
            {latestNews.map((news, index) => (
              <div key={index} className="border-l-4 border-indigo-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-1">
                  <a 
                    href={news.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600"
                  >
                    {news.title}
                  </a>
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {news.content?.substring(0, 120)}...
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(news.pubDate).toLocaleDateString('ko-KR')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🎥 관련 영상</h3>
          <div className="space-y-4">
            {youtubeVideos.map((video, index) => (
              <div key={index} className="flex space-x-3">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-24 h-18 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    <a 
                      href={`https://youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-indigo-600"
                    >
                      {video.title}
                    </a>
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {video.description?.substring(0, 80)}...
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(video.publishedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsSummary