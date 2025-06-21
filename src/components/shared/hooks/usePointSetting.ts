import { useQuery } from '@tanstack/react-query'
import { getPointSetting } from '../../../data'

export function usePointSetting(pointSettingId?: string) {
  return useQuery({
    queryKey: ['pointSetting', pointSettingId],
    // TODO: refactor into separate function
    queryFn: async () => {
      const res = await getPointSetting(pointSettingId)
      if (!res.ok) {
        throw new Error(`Point setting not found (status: ${res.status})`)
      }
      return res.json()
    },
    enabled: !!pointSettingId,
  })
}
