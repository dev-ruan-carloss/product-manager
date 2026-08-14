;(function () {
  try {
    var key = 'product-management:theme'
    var saved = localStorage.getItem(key)
    var theme =
      saved === 'light' || saved === 'dark'
        ? saved
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
    document.documentElement.style.colorScheme = theme
  } catch {
    /* ignore */
  }
})()
