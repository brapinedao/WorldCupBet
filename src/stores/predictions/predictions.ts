import { defineStore } from 'pinia'

import { usePredictions, type IUpsertPredictionPayload } from '@/composables/usePredictions'
import type { IPrediction, IUserPrediction } from '@/interfaces/customs/predictions/Predictions'

interface IPredictionsState {
  predictions: IPrediction[]
  matchPredictions: IUserPrediction[]
}

export const usePredictionsStore = defineStore('predictions', {
  state: (): IPredictionsState => ({
    predictions: [],
    matchPredictions: [],
  }),
  actions: {
    async _getListPredictions(userId: number): Promise<boolean> {
      const { fetchPredictionsByUser } = usePredictions()
      this.predictions = await fetchPredictionsByUser(userId)
      return true
    },

    async _getMatchPredictions(matchId: number): Promise<boolean> {
      const { fetchPredictionsByMatch } = usePredictions()
      this.matchPredictions = await fetchPredictionsByMatch(matchId)
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
