export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  ENDPOINTS: {
    CHAT: "/api/v1/chat",
    DASHBOARD: "/api/v1/dashboard",
    DASHBOARD_CHART: "/api/v1/dashboard/chart",
  },
  TIMEOUT: 45000,
} as const

export const buildApiUrl = (
  endpoint: keyof typeof API_CONFIG.ENDPOINTS,
  params?: Record<string, string | number>,
): string => {
  const baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })
    return `${baseUrl}?${searchParams.toString()}`
  }

  return baseUrl
}

export const apiClient = {
  async post<T>(endpoint: keyof typeof API_CONFIG.ENDPOINTS, data: any): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    try {
      const response = await fetch(buildApiUrl(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  },

  async get<T>(endpoint: keyof typeof API_CONFIG.ENDPOINTS, params?: Record<string, string | number>): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    try {
      const url = buildApiUrl(endpoint, params)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  },
}
