import styled from 'styled-components/macro';

interface Props {
  width?: string;
  height?: string;
}
const Spacer = styled.div<Props>`
  flex-shrink: 0;
  position: relative;
  width: ${({ width }) => (width ? width : '100%')};
  height: ${({ height }) => (height ? height : '16px')};
`;
export default Spacer;
