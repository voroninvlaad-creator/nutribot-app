export const metadata = {
  title: 'NutriBot',
  description: 'Умный трекер КБЖУ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
