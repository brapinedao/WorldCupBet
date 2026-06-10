import { defineStore } from 'pinia'

import { usePredictions, type IUpsertPredictionPayload } from '@/composables/usePredictions'
import type { IPrediction } from '@/interfaces/customs/predictions/Predictions'

interface IPredictionsState {
  predictions: IPrediction[]
}

export const usePredictionsStore = defineStore('predictions', {
  state: (): IPredictionsState => ({
    predictions: [],
  }),
  actions: {
    async _getListPredictions(userId: number): Promise<boolean> {
      const { fetchPredictionsByUser } = usePredictions()
      this.predictions = await fetchPredictionsByUser(userId)
      return true
    },

    async _updatePrediction(payload: IUpsertPredictionPayload): Promise<boolean> {
      const { upsertPrediction } = usePredictions()
      const success = await upsertPrediction(payload)

      if (success) {
        await this._getListPredictions(payload.userId)
      }

      return success
    },
  },
})
