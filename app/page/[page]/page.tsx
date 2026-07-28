import TodoApp from '@/app/components/TodoApp'

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page } = await params
  const pageNumber = Number(page)
  const validPage = Number.isInteger(pageNumber) && pageNumber >= 1 ? pageNumber : 1

  return <TodoApp page={validPage} />
}
