export interface INewsItem {
  emoji: string
  headline: string
  excerpt: string
}

export const NEWS_ITEMS: INewsItem[] = [
  {
    emoji: '🔥',
    headline: '¡Arrancó el Mundial más grande de la historia!',
    excerpt:
      '48 selecciones, 12 grupos y 104 partidos: la oportunidad perfecta para liderar la polla de HP.',
  },
  {
    emoji: '🌎',
    headline: '3 países, 1 sola Copa',
    excerpt:
      'México, Canadá y Estados Unidos son sede. Inaugural en el Estadio Azteca y gran final en el MetLife Stadium.',
  },
  {
    emoji: '🥅',
    headline: '¡Más equipos, más drama!',
    excerpt:
      'La nueva ronda de 32 le da otra vida a tu selección favorita... y a ti más chances de superar a tus colegas de HP.',
  },
  {
    emoji: '🏆',
    headline: '39 días para ser el campeón de la oficina',
    excerpt:
      'Del 11 de junio al 19 de julio: tiempo de sobra para escalar el ranking de HP World Cup.',
  },
]
