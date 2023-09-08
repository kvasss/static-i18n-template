export const bp = {
  xxl: 1440,
  xl: 1200,
  md: 992,
  sm: 768,
  xs: 576,
  xxs: 480
};

// window width
export const ww = document.body.clientWidth;

export const tStyle = {
  transformStyle: "preserve-3d",
}

export const scrollFrom = {
  opacity: 0,
  // ...tStyle,
};

export const scrollTo = {
  duration: ww < bp ? 0.25 : 0.4,
  opacity: 1,
  // ...tStyle,
};
