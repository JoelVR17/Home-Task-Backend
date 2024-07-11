export const generate6digitToken = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
