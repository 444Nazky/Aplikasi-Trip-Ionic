export const toggleDarkMode = () => {
  const isDark = localStorage.getItem('darkMode') === 'true';
  localStorage.setItem('darkMode', String(!isDark));
  document.documentElement.classList.toggle('dark', !isDark);
};

export const initDarkMode = () => {
  const isDark = localStorage.getItem('darkMode') === 'true';
  document.documentElement.classList.toggle('dark', isDark);
};
