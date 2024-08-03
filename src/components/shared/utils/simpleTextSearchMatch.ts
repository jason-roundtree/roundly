export default function simpleTextSearchMatch(
  searchQuery: string,
  textToCheck: string
): boolean {
  const _searchQuery = searchQuery.toLowerCase()
  const _textToCheck = textToCheck.toLowerCase()
  return _textToCheck.indexOf(_searchQuery) > -1
}
