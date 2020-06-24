// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    primary: string;
    primaryAccent: string;
    white: string;
    grey: {
      lightest: string;
      lighter: string;
      light: string;
      base: string;
      dark: string;
      darker: string;
      darkest: string;
    };
    black: string;
  }
}
