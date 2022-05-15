export const setTheme = (t) => {
    document.getElementsByTagName('html')[0].setAttribute('data-theme', t)
    window.localStorage.setItem('phs-theme', t)
}

export const loadTheme = () => {
    let savedTheme = localStorage.getItem('phs-theme')
    document.getElementsByTagName('html')[0].setAttribute('data-theme', savedTheme)
}